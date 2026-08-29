# Los planos de la sección azul — qué pedir y dónde ponerlos

## Por qué hay que rehacerlos

Los 60 actuales son **la misma foto recortada cada vez más**. Se comprobó
recortando el plano 1 y comparándolo con el 40: salen casi idénticos. El
ángulo no cambia, los reflejos no cambian, la camioneta nunca gira.

Por eso el efecto no se ve. No es cosa del código: no hay movimiento en el
material que enseñar.

Lo que hace que algo se lea como "se me viene encima" es que **la perspectiva
cambie**. De lejos una camioneta se ve plana, casi como un dibujo de lado. De
cerca el frente crece más rápido que los lados y estos se escapan hacia atrás.
Eso solo pasa si la cámara se mueve de verdad.

---

## El pedido, para copiar y pegar

> Necesito una serie de **20 imágenes** del mismo Toyota Tacoma TRD Pro azul,
> en el mismo estudio oscuro con luz azul y suelo reflectante, exactamente la
> misma camioneta y la misma iluminación en todas.
>
> Lo que cambia entre una y otra es **la posición de la cámara**, que avanza
> hacia la camioneta: empieza a unos 8 metros y termina a 80 centímetros del
> faro delantero izquierdo, a la altura del capó.
>
> - Imagen 1: la camioneta entera, en tres cuartos delantero izquierdo,
>   pequeña dentro del encuadre, con estudio visible alrededor.
> - Imagen 10: el frente y parte del lateral llenan el encuadre.
> - Imagen 20: solo la parrilla y el faro delantero izquierdo.
>
> **Importante: no quiero un recorte de la misma imagen.** La perspectiva
> tiene que cambiar como cambia de verdad al caminar hacia un vehículo: de
> lejos se ve plana, de cerca el frente domina y los lados se escapan hacia
> atrás con las líneas convergiendo.
>
> Formato 16:9, 1600×900 píxeles, sin texto ni marcas de agua.

---

## El truco para que salgan consistentes

Los generadores de imagen pierden la consistencia si les pides las 20 de
golpe: sale otra camioneta, otra luz, otro suelo.

Hazlo así:

1. Genera **la primera** y déjala bien: camioneta entera, en tres cuartos.
2. Para cada siguiente, **adjunta la anterior** y pide:
   *"La misma camioneta, el mismo estudio y la misma luz. Mueve la cámara
   un paso más cerca del faro delantero izquierdo. Que cambie la perspectiva,
   no que recortes la imagen."*
3. Repite. Si en alguna cambia la camioneta o la luz, tírala y repítela.

---

## Cuántas hacen falta de verdad

**Ocho buenas valen más que sesenta iguales.** Con movimiento real de cámara,
ocho o diez planos ya dan el efecto. No te pelees por llegar a veinte si la
consistencia se rompe: mándame las que salgan bien.

---

## Dónde ponerlas

Crea la carpeta y deja los archivos dentro con cualquier nombre, mientras
estén en orden:

```
assets/features/dolly-nuevo/
```

Avísame cuando estén. Yo me encargo del resto:

- Mido el acercamiento real de cada una para repartirlas parejas
- Genero la versión de teléfono y la de escritorio con el tamaño justo
- Las monto en la sección y compruebo nitidez y memoria

---

## Si no salen

Dímelo y convierto la sección en un recorrido de detalle —del conjunto a la
parrilla y el faro, con un dato en cada parada—. Con el material actual eso
sí funciona, porque es exactamente lo que el material hace.
