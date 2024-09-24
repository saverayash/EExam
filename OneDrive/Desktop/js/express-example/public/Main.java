import java.io.*;
import java.util.*;

public class main {
    private static final FastIO sc = new FastIO();

    public static void main(String[] args) {
        int t = sc.nextInt();
        while (t-- > 0) {
            solve();
        }
    }

   
    
    static void solve() {
        int n = sc.nextInt();
        long[] a = new long[n + 1];
        int[] parent = new int[n + 1];
        parent[1] = 0;

        // Read values for array a
        for (int i = 1; i <= n; i++) {
            a[i] = sc.nextLong();
        }

        // Read values for parent array

        // Initialize adjacency list
        ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) {
            adj.add(new ArrayList<>());
        }

        for (int i = 2; i <= n; i++) {
            adj.get(sc.nextInt()).add(i);
        }

        
        solve(1,adj,a);
        System.out.println(a[1]);
    }

    static long solve(int e, ArrayList<ArrayList<Integer>> adj, long[] a) {

        long min=Long.MAX_VALUE;
        
         for(int ele:adj.get(e))
         min=Math.min(min,solve(ele,adj,a));

         
            if(e==1 && min!=Long.MAX_VALUE)
            {
            a[e]+=min;
            return a[e];
            }
            else if(e==1)
            {
                return a[e];
            }
            if(adj.get(e).size()==0)
            return a[e];

            if(a[e]<min)
            {
        return (a[e]+min)/2;
            }
            return min;
    }
    static class FastIO extends PrintWriter {
        private BufferedReader br;
        private StringTokenizer st;

        public FastIO() {
            this(System.in, System.out);
        }

        public FastIO(InputStream in, OutputStream out) {
            super(out);
            br = new BufferedReader(new InputStreamReader(in));
        }

        public FastIO(String input, String output) throws FileNotFoundException {
            super(output);
            br = new BufferedReader(new FileReader(input));
        }

        public String next() {
            try {
                while (st == null || !st.hasMoreTokens()) {
                    st = new StringTokenizer(br.readLine());
                }
                return st.nextToken();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }

        public int nextInt() {
            return Integer.parseInt(next());
        }

        public double nextDouble() {
            return Double.parseDouble(next());
        }

        public long nextLong() {
            return Long.parseLong(next());
        }
    }
}


