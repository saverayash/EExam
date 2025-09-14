import java.io.*;
import java.util.*;

public class Main {
    private static final FastIO sc = new FastIO();
    static StringBuffer str=new StringBuffer();
    

    public static void main(String[] args) {
       int t=sc.nextInt();
       
        while (t-- > 0) {
           solve();
        }
        System.out.println(str);
    }
    
    static void solve() {
        long n = sc.nextLong();
        long x = sc.nextLong();
    
        if (n == 1) {
            if (x == 0) {
                str.append("-1\n");
            } else {
                str.append(x + "\n");
            }
            return;
        }
    
        if (n == 2) {
            if (x == 0) {
                str.append("-1\n");
            } else {
                str.append("0 " + x + "\n");
            }
            return;
        }
    
        // For n >= 3, always possible
        List<Long> res = new ArrayList<>();
        long xor = 0;
        for (int i = 1; i <= n - 3; i++) {
            res.add(1L);
            xor ^= 1;
        }
    
        // Choose 2 large numbers to avoid collision with previous
        long a = 1L << 17; // 131072
        long b = 1L << 18; // 262144
    
        xor ^= a;
        xor ^= b;
    
        long c = xor ^ x;
    
        // Ensure c is distinct from a and b and not 0
        if (c == 0 || c == a || c == b || res.contains(c)) {
            // Fix collision by increasing a, b
            a = 1L << 19; // 524288
            b = 1L << 20; // 1048576
            xor = 1 ^ ((n - 3) % 2); // XOR of the 1s
            xor ^= a;
            xor ^= b;
            c = xor ^ x;
        }
    
        res.add(a);
        res.add(b);
        res.add(c);
    
        for (long val : res) {
            str.append(val).append(" ");
        }
        str.append("\n");
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
