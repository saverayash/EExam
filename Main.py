import numpy as np

def solve():
#    a=[][]
   s=set()
   s.add(0)
   s.add(1)
   s.add(2)
   print(s)
   print(len(s))
   print(0 in s)
   print(3 in s)
   for key in s:
      print(f"{key} ",end="")
   a=[[0]* 4 for _ in range(3)]
   i=0
   j=0
   for i in range(3):
      for j in range(3):
        a[i][j]=input()
   print(a)

def checksqr(n):
    sq = int(np.sqrt(n))
    return sq * sq == n

t = int(input())

for _ in range(t):
    solve()
