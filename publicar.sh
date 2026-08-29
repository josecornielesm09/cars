#!/usr/bin/env bash
# Sube la version de cache en TODAS partes a la vez y publica.
#
# El preload del hero llevaba su propia version, congelada desde hacia
# varios despliegues. El navegador pedia ?v=viejo y el script ?v=nuevo:
# dos URLs distintas, asi que la precarga se descargaba y no la usaba
# nadie. Por eso esto va en un solo sitio.
set -e
cd "$(dirname "$0")"

V=$(date +%s)
sed -i "s/var ASSETS_V = \"[0-9]*\"/var ASSETS_V = \"$V\"/" script.js
sed -i -E "s/\?v=[0-9]+//g" index.html
sed -i -E "s/(href|src)=\"(assets\/[^\"?]+|style\.css|script\.js)\"/\1=\"\2?v=$V\"/g" index.html

node --check script.js
python -c "s=open('style.css',encoding='utf-8').read(); assert s.count('{')==s.count('}'), 'llaves descuadradas'"

echo "version $V"
grep -c "v=$V" index.html
