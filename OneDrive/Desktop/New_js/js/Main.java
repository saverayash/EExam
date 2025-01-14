import java.io.*;
import java.util.*;

public class Main {
    private static final FastIO sc = new FastIO();
     
    public static void main(String[] args) {
        int t = sc.nextInt();

      
        while (t-- > 0) {
            solve();
        }
    }

    static void solve() {
      int n=sc.nextInt();
      int m=sc.nextInt();
      String s=sc.next();
      int i=0,j=0;
      long [][] a=new long [n][m];
      long [] r=new long [n];
      long [] c=new long [m];
      for(i=0;i<n;i++)
      {
             for(j=0;j<m;j++)
             {
                long val=sc.nextLong();
                a[i][j]=val;
                r[i]+=val;
                c[j]+=val;
             }
      }
      i=0;j=0;
      while(true)
      {
           if(i+j>=s.length())
           break;
           if(s.charAt(i+j)=='D')
           {
                 a[i][j]=-r[i];
                 c[j]+=a[i][j];
                 i++;
           }
           else
           {
                 a[i][j]=-c[j];
                 r[i]+=a[i][j];
                 j++;
           }
      }
      a[n-1][m-1]=-r[n-1];
      StringBuffer str=new StringBuffer();
      for(i=0;i<n;i++)
      {
          for(j=0;j<m;j++)
          str.append(a[i][j]+" ");
          if(i!=n-1)
          str.append('\n');
      }
      System.out.println(str);
    }
   
   static int gcd(int a,int b)
   {
           if(b>a)
           return gcd(b,a);

           if(b==0)
           return a;
           return gcd(b,a%b);
   }
    static class Pair
    {
        int x;
        int y;
        Pair(int x,int y)
        {
            this.x=x;
            this.y=y;
        }
        @Override
        public boolean equals(Object o) {
            // Check if the object is of the same type
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Pair pair = (Pair) o;
            return (x == pair.x && y == pair.y) || (x == pair.y && y == pair.x);  // Ensure pairs are equal regardless of order
        }
    
        @Override
        public int hashCode() {
            return Objects.hash(Math.min(x, y), Math.max(x, y));  // Generate hash code based on ordered pair values
        }
    }
   
    static long modInverse(long x, long m) {
        return power(x, m - 2, m);  
    }
    static long power(long x, long y, long m) {
        long res = 1;
        x = x % m;
        while (y > 0) {
            if ((y & 1) == 1) {
                res = (res * x) % m;
            }
            y = y >> 1;
            x = (x * x) % m;
        }
        return res;
    }
        

    static class FastIO {
        BufferedReader br;
        StringTokenizer st;

        FastIO() {
            br = new BufferedReader(new InputStreamReader(System.in));
        }

        String next() {
            while (st == null || !st.hasMoreTokens()) {
                try {
                    st = new StringTokenizer(br.readLine());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return st.nextToken();
        }

        int nextInt() {
            return Integer.parseInt(next());
        }

        long nextLong() {
            return Long.parseLong(next());
        }
    }
}
