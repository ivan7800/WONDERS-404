"""EIFFEL 404. Ejecutar con Blender: blender --background --python blender/crear_torre.py
Genera una torre estilizada editable y exporta eiffel_404.glb en esta carpeta.
No constituye una reconstrucción arquitectónica exacta.
"""
import bpy, math, os
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
steel=bpy.data.materials.new('Hierro parisino'); steel.diffuse_color=(.3,.23,.17,1)
gold=bpy.data.materials.new('Iluminación dorada'); gold.diffuse_color=(.95,.65,.26,1)
segments=[]
def beam(a,b,r=.28,material=steel):
    mid=(Vector(a)+Vector(b))/2; d=Vector(b)-Vector(a)
    if d.length<.001:return
    bpy.ops.mesh.primitive_cylinder_add(vertices=6,radius=r,depth=d.length,location=mid)
    ob=bpy.context.object;ob.rotation_euler=d.to_track_quat('Z','Y').to_euler();ob.data.materials.append(material);ob.name='Viga estructural'
def radius(h):
    tiers=[(0,57,57,31),(57,115,31,18),(115,195,18,10),(195,276,10,5),(276,311,5,3.4),(311,330,3.4,.5)]
    for lo,hi,a,b in tiers:
        if h<=hi:return a+(b-a)*(h-lo)/(hi-lo)
    return .5
def corners(h):
    r=radius(h);return [(-r,-r,h),(r,-r,h),(r,r,h),(-r,r,h)]
for lo,hi in [(0,57),(57,115),(115,195),(195,276),(276,311),(311,330)]:
    steps=max(3,math.ceil((hi-lo)/10))
    for j in range(steps):
        a=corners(lo+(hi-lo)*j/steps); b=corners(lo+(hi-lo)*(j+1)/steps)
        for i in range(4):
            beam(a[i],b[i],.55);beam(a[i],b[(i+1)%4],.16);beam(a[(i+1)%4],b[i],.16);beam(a[i],a[(i+1)%4],.22)
for h in (57,115,276):
    r=radius(h)+3
    c=[(-r,-r,h),(r,-r,h),(r,r,h),(-r,r,h)];d=[(x,y,h+4) for x,y,_ in c]
    for i in range(4):beam(c[i],c[(i+1)%4],.7);beam(d[i],d[(i+1)%4],.4);beam(c[i],d[i],.25)
for i in range(4):
    p=corners(0)[i];q=corners(0)[(i+1)%4];last=None
    for j in range(25):
        t=j/24;pt=(p[0]*(1-t)+q[0]*t,p[1]*(1-t)+q[1]*t,42*(1-(2*t-1)**2))
        if last:beam(last,pt,.42)
        last=pt
# Join for more efficient export
bpy.ops.object.select_all(action='SELECT');bpy.context.view_layer.objects.active=bpy.context.selected_objects[0];bpy.ops.object.convert(target='MESH');bpy.ops.object.join()
output=os.path.join(os.path.dirname(os.path.abspath(__file__)),'eiffel_404.glb')
bpy.ops.export_scene.gltf(filepath=output,export_format='GLB');print('Exportado:',output)
