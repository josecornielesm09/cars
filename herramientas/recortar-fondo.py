"""Recorta el fondo de una foto y deja el objeto con transparencia.

Este entorno trae onnxruntime pero no pip, asi que no se puede instalar
rembg. En su lugar se ejecuta directamente el modelo que rembg usa por
dentro, en su version chica:

    curl -sL -o u2netp.onnx       https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx

Son 4,7 MB, licencia Apache 2.0. Deja el .onnx junto a este archivo.

    python recortar-fondo.py foto.jpg recorte.png

Despues, para servirlo en la web, recorta el vacio del lienzo y bajalo al
tamano en que se va a ver: un recorte de 1600px mostrado a 120 gasta seis
megas de memoria para nada.
"""
import sys
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

import os
MODELO = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'u2netp.onnx')
LADO = 320

def mascara(im):
    ses = ort.InferenceSession(MODELO, providers=['CPUExecutionProvider'])
    chica = im.convert('RGB').resize((LADO, LADO), Image.BILINEAR)
    a = np.asarray(chica, np.float32) / 255.0
    # normalizacion con la que se entreno la red
    a = (a - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
    a = a.transpose(2, 0, 1)[None].astype(np.float32)
    sal = ses.run(None, {ses.get_inputs()[0].name: a})[0][0, 0]
    sal = (sal - sal.min()) / (sal.max() - sal.min() + 1e-8)
    m = Image.fromarray((sal * 255).astype(np.uint8)).resize(im.size, Image.BICUBIC)
    return m

def recortar(entrada, salida):
    im = Image.open(entrada).convert('RGB')
    m = mascara(im)
    a = np.asarray(m, np.float32) / 255.0
    # curva dura en el centro: deja opaco lo claramente objeto, transparente
    # lo claramente fondo, y solo difumina la orilla
    a = np.clip((a - 0.42) / 0.30, 0, 1)
    m = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    out = im.convert('RGBA'); out.putalpha(m)
    bb = m.point(lambda v: 255 if v > 12 else 0).getbbox()
    if bb: out = out.crop(bb)
    out.save(salida)
    print('recortado ->', salida, out.size)
    return out

if __name__ == '__main__':
    recortar(sys.argv[1], sys.argv[2])
