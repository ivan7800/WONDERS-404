"""Generates Eiffel-inspired detailed GLB in Y-up; stylized, not survey-grade. No Blender dependency for reproducible export."""
import math, os
import numpy as np
import trimesh
V=[];F=[]; colors=[]
def rod(a,b,r=0.25, sides=6, color=(114,83,58,255)):
 a=np.array(a,float); b=np.array(b,float); d=b-a
 norm=np.linalg.norm(d)
 if norm<1e-5:return
 axis=d/norm; ref=np.array([1.,0.,0.]) if abs(axis[0])<.85 else np.array([0.,0.,1.]); u=np.cross(axis,ref);u/=np.linalg.norm(u);v=np.cross(axis,u)
 start=len(V)
 for p in (a,b):
  for i in range(sides):
   ang=2*math.pi*i/sides;V.append(p+r*(math.cos(ang)*u+math.sin(ang)*v));colors.append(color)
 for i in range(sides):
  j=(i+1)%sides;F.append((start+i,start+j,start+sides+j));F.append((start+i,start+sides+j,start+sides+i))
 F.extend([(start, start+i+1,start+i) for i in range(1,sides-1)])
 F.extend([(start+sides,start+sides+i,start+sides+i+1) for i in range(1,sides-1)])
TIERS=[(0,57,57,31),(57,115,31,18),(115,195,18,10),(195,276,10,5),(276,311,5,3.4),(311,330,3.4,.5)]
def radius(h):
 for lo,hi,x,y in TIERS:
  if h<=hi:return x+(y-x)*(h-lo)/(hi-lo)
 return .5
def corners(h):
 r=radius(h);return [(-r,h,-r),(r,h,-r),(r,h,r),(-r,h,r)]
for lo,hi,_,_ in TIERS:
 n=max(5,math.ceil((hi-lo)/5))
 for j in range(n):
  a=corners(lo+(hi-lo)*j/n);b=corners(lo+(hi-lo)*(j+1)/n)
  for i in range(4):
   k=(i+1)%4;rod(a[i],b[i],.78);rod(a[i],b[k],.19);rod(a[k],b[i],.19);rod(a[i],a[k],.25)
   if j%2==0:rod(a[i],b[(i+2)%4],.12,color=(94,72,54,255))
for h in (57,115,276):
 r=radius(h)+3.5;c=[(-r,h,-r),(r,h,-r),(r,h,r),(-r,h,r)];d=[(x,h+5,z) for x,_,z in c]
 for i in range(4):
  k=(i+1)%4;rod(c[i],c[k],.95);rod(d[i],d[k],.5);rod(c[i],d[i],.44)
  for m in range(1,12):
   t=m/12;p=[c[i][e]*(1-t)+c[k][e]*t for e in range(3)];q=[d[i][e]*(1-t)+d[k][e]*t for e in range(3)];rod(p,q,.14)
  # inner deck edges
  rod(c[i],corners(h)[i],.3)
base=corners(0)
for i in range(4):
 p=base[i];q=base[(i+1)%4];last=None
 for j in range(33):
  t=j/32;y=42*(1-(2*t-1)**2);pt=(p[0]*(1-t)+q[0]*t,y,p[2]*(1-t)+q[2]*t)
  if last is not None:rod(last,pt,.6)
  last=pt
# Deck floors, perimeter braces, railings and ribs; all merged into a single colored mesh.
for h,overhang in [(57,4.5),(115,4.0),(276,2.5)]:
 r=radius(h)+overhang
 lo=[(-r,h,-r),(r,h,-r),(r,h,r),(-r,h,r)]
 for side in range(4):
  a=lo[side];b=lo[(side+1)%4]
  for yh,thick in [(0,.65),(.8,.38),(2,.16),(3.5,.18)]:
   rod((a[0],h+yh,a[2]),(b[0],h+yh,b[2]),thick,color=(131,99,71,255))
  for m in range(17):
   t=m/16;xx=a[0]*(1-t)+b[0]*t;zz=a[2]*(1-t)+b[2]*t
   rod((xx,h+.8,zz),(xx,h+3.5,zz),.095,color=(155,118,78,255))
  for m in range(1,7):
   t=m/7;xx=a[0]*(1-t)+b[0]*t;zz=a[2]*(1-t)+b[2]*t
   rod((xx,h,zz),(.3*xx,h,.3*zz),.25)
 # floor's cross braces
 for x in np.linspace(-r*.82,r*.82,5):
  rod((float(x),h,-r*.82),(float(x),h,r*.82),.24)
 for z in np.linspace(-r*.82,r*.82,5):
  rod((-r*.82,h,float(z)),(r*.82,h,float(z)),.24)
# Additional trusses on four structural faces at each construction bay.
for lo,hi,_,_ in TIERS[:5]:
 steps=max(2,math.ceil((hi-lo)/10))
 for j in range(steps):
  h0=lo+(hi-lo)*j/steps;h1=lo+(hi-lo)*(j+1)/steps
  c0=corners(h0);c1=corners(h1)
  for side in range(4):
   k=(side+1)%4
   for t in (.25,.5,.75):
    a=np.array(c0[side])*(1-t)+np.array(c0[k])*t
    b=np.array(c1[side])*(1-t)+np.array(c1[k])*t
    rod(a,b,.14,color=(102,75,54,255))
   # diagonal lattice subdivision along the face
   m0=(np.array(c0[side])+np.array(c0[k]))/2
   m1=(np.array(c1[side])+np.array(c1[k]))/2
   rod(c0[side],m1,.12);rod(c0[k],m1,.12)
   rod(m0,c1[side],.12);rod(m0,c1[k],.12)
# Four slanted guide tracks / elevator rails from ground to the first deck
for sx in (-1,1):
 for sz in (-1,1):
  last=None
  for h in range(0,58,3):
   r=radius(h)*.78
   pt=(sx*r,h,sz*r)
   if last:rod(last,pt,.22,color=(73,73,72,255))
   last=pt
# Observation crown, upper taper and antenna, with horizontal rings.
for h in (284,292,300,308,316,322):
 r=max(.6,radius(h));c=corners(h)
 for k in range(4):rod(c[k],c[(k+1)%4],.24,color=(133,106,78,255))
for h in range(280,328,3):rod((0,h,0),(0,h+3,0),.4,color=(112,90,69,255))
rod((0,328,0),(0,330,0),.12,color=(138,128,112,255))
mesh=trimesh.Trimesh(vertices=np.asarray(V),faces=np.asarray(F),vertex_colors=np.asarray(colors,dtype=np.uint8),process=False)
scene=trimesh.Scene();scene.add_geometry(mesh,geom_name='EIFFEL_404_ironwork')
path=os.path.join(os.path.dirname(__file__),'assets','eiffel_404.glb');os.makedirs(os.path.dirname(path),exist_ok=True)
with open(path,'wb') as f:f.write(scene.export(file_type='glb'))
print('GLB:',path,'bytes',os.path.getsize(path),'vertices',len(V),'faces',len(F))
