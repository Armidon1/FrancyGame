from PIL import Image
import sys
PAL_S = {
 '.':None,'K':(42,29,26),'H':(74,46,34),'h':(110,72,50),'S':(241,198,160),'s':(214,160,124),
 'G':(201,161,74),'E':(42,29,26),'B':(196,150,120),'C':(33,44,70),'c':(20,28,46),
 'F':(47,96,72),'f':(25,46,62),'P':(40,40,50),'O':(70,48,36),'W':(235,235,240),'M':(150,80,70),
}
PAL_F = {
 '.':None,'K':(58,36,30),'H':(176,128,78),'h':(222,184,124),'d':(128,88,54),'S':(248,212,186),
 's':(226,178,150),'E':(70,120,175),'R':(240,150,150),'M':(205,226,190),'m':(168,198,152),
 'Y':(232,190,70),'L':(30,30,36),'J':(104,128,176),'j':(78,98,142),'O':(60,48,44),'W':(255,255,255),'r':(196,98,104),
}
SIM = {
'down':[
"......KKKK......",
"....KKHHHHKK....",
"...KHHhhHHHHK...",
"..KHHHHHHhhHHK..",
"..KHHhHHHHHHHK..",
"..KHHHSSSSHHHK..",
"..KHSSSSSSSSHK..",
"..KSGGSSSSGGSK..",
"..KGSEGGGGESGK..",
"..KsGGSSSSGGsK..",
"...KSBSSSSBSK...",
"...KBBSMMSBBK...",
"....KBBBBBBK....",
"...KFFfFFfFFK...",
"..KCFFfFFfFFCK..",
"..KCCCFfCCCCCK..",
".KCCCCFfCCCCCCK.",
".KSCCCCcCCCCCSK.",
"..KCCCCcCCCCCK..",
"...KPPPKKPPPK...",
"...KPPPK.KPPPK..",
"...KOOOK.KOOOK..",
],
'up':[
"......KKKK......",
"....KKHHHHKK....",
"...KHHhhHHHHK...",
"..KHHHHHHhhHHK..",
"..KHHhHHHHHHHK..",
"..KHHHHHHHHHHK..",
"..KHHHhHHHHHHK..",
"..KGHHHHHHHHGK..",
"..KHHHHhHHHHHK..",
"..KsHHHHHHHHsK..",
"...KHHHHHHHHK...",
"...KsSSSSSSsK...",
"....KSSSSSSK....",
"...KFFfFFfFFK...",
"..KCFFfFFfFFCK..",
"..KCCCCCCCCCCK..",
".KCCCCCcCCCCCCK.",
".KSCCCCcCCCCCSK.",
"..KCCCCcCCCCCK..",
"...KPPPKKPPPK...",
"...KPPPK.KPPPK..",
"...KOOOK.KOOOK..",
],
'left':[
"......KKKK......",
"....KKHHHHKK....",
"...KHhhHHHHHK...",
"..KHHHHHHhHHHK..",
"..KHHHHHHHHhHK..",
"..KSSHHHHHHHHK..",
".KSSSSSHHHHHHK..",
".KSGGSSSHHHHHK..",
".KGESGGGGHHHK...",
".KSGGSSSssHHK...",
"..KSSSSSSsHK....",
"..KMSSBBBSK.....",
"...KBBBBBK......",
"...KFFfFFFK.....",
"..KCFFfFFFCK....",
"..KCCFfCCCCK....",
"..KCCFfCCCCK....",
"..KCSSCCCCCK....",
"..KCCCcCCCCK....",
"...KPPPPPPK.....",
"...KPPKKPPK.....",
"...KOOK.KOOK....",
],
}
FRA = {
'down':[
"......KKKK......",
"....KKhHHhKK....",
"...KHhHHHHhHK...",
"..KHhHHddHHhHK..",
"..KHHHdSSdHHHK..",
".KHHHSSSSSSHHHK.",
".KHhSSSSSSSShHK.",
".KHhSLLSSLLShHK.",
".KHhSESSSSESHhK.",
".KHHRSSSSSSRHHK.",
".KHhHSSrrSSHhHK.",
".KHhhKSSSSKhhHK.",
".KHhHKMMMMKHhHK.",
"KHhHMMSYSSMMHhHK",
"KHhMMMSSSSMMMhHK",
"KHdMLMmMMmMMMdHK",
".KKMLMMMMMMMMKK.",
"..KSLMMmmMMMSK..",
"..KMMLMMMMMMMK..",
"...KJJJKKJJJK...",
"...KJJJK.KJJJK..",
"...KOOOK.KOOOK..",
],
'up':[
"......KKKK......",
"....KKhHHhKK....",
"...KHhHHHHhHK...",
"..KHhHHHHHHhHK..",
"..KHHHhHHhHHHK..",
".KHHhHHHHHHhHHK.",
".KHhHHHhHHHHhHK.",
".KHhHHHHHHhHhHK.",
".KHHhHHhHHHHHHK.",
".KHhHHHHhHHhHHK.",
".KHhHhHHHHhHhHK.",
".KHHhHHHhHHHhHK.",
".KHhHHhHHHhHHHK.",
".KMHhHHHHHHhHMK.",
".KMMHdHHhHHdHMMK",
".KMMMdHdHHdHdMMK",
".KKMMMMMMMMLMKK.",
"..KSMMmmMMMLSK..",
"..KMMMMMMMLMMK..",
"...KJJJKKJJJK...",
"...KJJJK.KJJJK..",
"...KOOOK.KOOOK..",
],
'left':[
"......KKKK......",
"....KKhHHhKK....",
"...KHhhHHHHhK...",
"..KHhHHHHhHHHK..",
"..KhHHHHHHhHHK..",
"..KSSHHHHHHhHHK.",
".KSSSSSHHHHhHHK.",
".KSLLSSShHHHhHK.",
".KSESSSShHHhHHK.",
".KRSSSSShHHHhHK.",
"..KrSSSHhHHhHHK.",
"..KSSSKhHHhHHHK.",
"...KKMKHhHHhHHK.",
"...KMMMKhHHHhHK.",
"..KMMMMMKhHhHdK.",
"..KMSSMMMKdHdK..",
"..KMSSMMMMKKK...",
"..KMMMmMMMMK....",
"..KMMMMMMMMK....",
"...KJJJJJJK.....",
"...KJJKKJJK.....",
"...KOOK.KOOK....",
],
}
def legs(rows, d, f):
    rows = list(rows)
    if f==0: return rows
    if d in ('down','up'):
        A = rows[-3:]
        if f==1:
            new = ["...KPPPKKPPPK...", "...KPPPK.KOOOK..", "...KOOOK........"]
        else:
            new = ["...KPPPKKPPPK...", "...KOOOK.KPPPK..", "........KOOOK..."]
        P = 'P' if 'P' in A[0] else 'J'
        new = [r.replace('P',P) for r in new]
        # keep the column-gap shapes identical to stand version
        return rows[:-3]+new
    else:
        P = 'P' if 'P' in rows[-3] else 'J'
        if f==1: new=["...KPPPPPPK.....","..KPPK.KPPK.....","..KOOK..KOOK...."]
        else:    new=["...KPPPPPPK.....","....KPPPPK......","....KOOOOK......"]
        return rows[:-3]+[r.replace('P',P) for r in new]
def render(grid, pal):
    for i,r in enumerate(grid): assert len(r)==16,(i,r,len(r))
    im = Image.new('RGBA',(16,len(grid)),(0,0,0,0))
    for y,r in enumerate(grid):
        for x,ch in enumerate(r):
            c = pal[ch]
            if c: im.putpixel((x,y),c+(255,))
    return im
def sheet(chr_, pal, name):
    # rows: down, left, right, up ; cols: stand, step1, stand, step2  -> use 3 frames
    order=['down','left','right','up']
    sh = Image.new('RGBA',(16*3,22*4),(0,0,0,0))
    for ri,d in enumerate(order):
        base = chr_['left'] if d=='right' else chr_[d]
        for f in range(3):
            g = legs(base, 'left' if d in('left','right') else d, f)
            im = render(g,pal)
            if d=='right': im = im.transpose(Image.FLIP_LEFT_RIGHT)
            sh.paste(im,(f*16,ri*22))
    sh.save(f'{name}_sheet.png')
    return sh
a=sheet(SIM,PAL_S,'simone'); b=sheet(FRA,PAL_F,'francesca')
S=8
prev = Image.new('RGBA',(48*S*2+40,88*S+20),(250,244,232,255))
prev.paste(b.resize((48*S,88*S),Image.NEAREST),(10,10),b.resize((48*S,88*S),Image.NEAREST))
prev.paste(a.resize((48*S,88*S),Image.NEAREST),(48*S+30,10),a.resize((48*S,88*S),Image.NEAREST))
prev.save('preview.png')
