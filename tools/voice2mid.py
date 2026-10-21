# Trascrive una traccia di sola voce (mp3/wav) in un MIDI con la melodia, da usare con midi2song.cjs (?melfile=...).
# Serve solo ffmpeg e numpy. Riconosce l'intonazione con l'algoritmo YIN, frame da 10 ms.
#   python3 tools/voice2mid.py local/cosasara_voce.mp3 local/cosasara_voce.mid
import struct
import subprocess
import sys

import numpy as np

SR, HOP, WIN = 16000, 160, 1024
FMIN, FMAX = 80.0, 1000.0


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def yin(x):
    n = (len(x) - WIN) // HOP
    tmin, tmax = int(SR / FMAX), int(SR / FMIN)
    pitch = np.zeros(n)
    rms = np.zeros(n)
    for b in range(0, n, 2000):
        idx = np.arange(b, min(n, b + 2000))
        fr = np.stack([x[i * HOP:i * HOP + WIN] for i in idx])
        rms[idx] = np.sqrt((fr ** 2).mean(axis=1))
        half = WIN // 2
        # differenza YIN tramite autocorrelazione con FFT
        F = np.fft.rfft(fr, 2 * WIN)
        ac = np.fft.irfft(F * np.conj(F))[:, :half]
        e = np.cumsum(fr ** 2, axis=1)
        energy0 = e[:, half - 1:half]
        lag = np.arange(half)
        shifted = np.array([e[:, half - 1 + t] - e[:, t - 1] if t else e[:, half - 1] for t in lag]).T
        d = energy0 + shifted - 2 * ac
        d[:, 0] = 0
        cm = d[:, 1:] * np.arange(1, half) / np.maximum(np.cumsum(d[:, 1:], axis=1), 1e-9)
        cm = np.concatenate([np.ones((len(idx), 1)), cm], axis=1)
        for j, row in enumerate(cm):
            seg = row[tmin:tmax]
            below = np.where(seg < 0.15)[0]
            if not len(below):
                continue
            t = below[0]
            while t + 1 < len(seg) and seg[t + 1] < seg[t]:
                t += 1
            T = t + tmin
            if 0 < T < half - 1:  # interpolazione parabolica
                a, bb, c = row[T - 1], row[T], row[T + 1]
                den = a - 2 * bb + c
                T = T + (a - c) / (2 * den) if den else T
            pitch[idx[j]] = SR / T
    return pitch, rms


def notes(pitch, rms):
    midi = np.where(pitch > 0, 69 + 12 * np.log2(np.maximum(pitch, 1) / 440), 0.0)
    loud = rms[rms > 0]
    midi[rms < max(0.004, np.percentile(loud, 90) * 0.08)] = 0
    # errori d'ottava: un frame un'ottava sopra/sotto i vicini torna nell'ottava giusta
    v = np.where(midi > 0)[0]
    for k in range(len(v)):
        i = v[k]
        ctx = midi[max(0, i - 25):i + 25]
        ref = np.median(ctx[ctx > 0])
        while midi[i] - ref > 9:
            midi[i] -= 12
        while ref - midi[i] > 9:
            midi[i] += 12
    # mediana su 9 frame (solo dove c'è voce): toglie gli scatti di un attimo, tiene le note cantate
    sm = midi.copy()
    for i in np.where(midi > 0)[0]:
        w = midi[max(0, i - 4):i + 5]
        w = w[w > 0]
        sm[i] = np.median(w) if len(w) >= 3 else 0
    midi = sm
    out, cur = [], None
    peak = rms.max() or 1

    def close():
        if cur and (cur['e'] - cur['s']) * HOP / SR >= 0.07:
            vals = np.array(cur['v'])
            p = int(round(np.median(vals)))
            vel = int(np.clip(30 + 90 * rms[cur['s']:cur['e']].mean() / peak, 30, 120))
            out.append((cur['s'] * HOP / SR, cur['e'] * HOP / SR, p, vel))
    for i, m in enumerate(midi):
        if m == 0:
            # buchi brevi (consonanti) non spezzano la nota
            if cur and i - cur['e'] > 4:
                close()
                cur = None
            continue
        if cur and abs(m - np.median(cur['v'][-12:])) < 0.9 and i - cur['e'] <= 5:
            cur['v'].append(m)
            cur['e'] = i + 1
        else:
            close()
            cur = {'s': i, 'e': i + 1, 'v': [m]}
    close()
    return out


def write_midi(path, ns):
    div, tps = 480, 960  # 120 bpm: 960 tick al secondo
    ev = []
    for t0, t1, p, v in ns:
        ev.append((round(t0 * tps), 1, p, v))
        ev.append((round(t1 * tps), 0, p, 0))
    ev.sort()

    def vl(n):
        b = [n & 0x7f]
        n >>= 7
        while n:
            b.insert(0, (n & 0x7f) | 0x80)
            n >>= 7
        return bytes(b)
    data, last = bytearray(b'\x00\xff\x51\x03\x07\xa1\x20'), 0
    for t, on, p, v in ev:
        data += vl(t - last) + bytes([0x90 if on else 0x80, p, v])
        last = t
    data += b'\x00\xff\x2f\x00'
    with open(path, 'wb') as f:
        f.write(b'MThd' + struct.pack('>IHHH', 6, 0, 1, div) + b'MTrk' + struct.pack('>I', len(data)) + data)


if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    ns = notes(*yin(load(src)))
    write_midi(dst, ns)
    ps = [n[2] for n in ns]
    print(f'{dst}: {len(ns)} note, da {min(ps)} a {max(ps)} (MIDI), prima nota a {ns[0][0]:.2f}s')
