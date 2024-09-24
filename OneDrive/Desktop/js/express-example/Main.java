import java.io.*;
import java.util.*;

public class Main {
    private static final FastIO sc = new FastIO();

    public static void main(String[] args) {
        System.out.println(smallestWindow("zoomlazapzo","oza"));
    }
     static String smallestWindow(String s, String p)
    {
          int i=0,j=0,n=s.length(),m=p.length(),ans=Integer.MAX_VALUE,f=0,k=0;
          String str="";
          int [] a=new int [26];
          int [] b=new int [26];
          for(i=0;i<m;i++)
          b[p.charAt(i)-'a']++;
          for(i=0;i<n;i++)
          {
              a[s.charAt(i)-'a']++;
              f=0;
              for(j=0;j<26;j++)
              {
                  if(a[j]<b[j])
                  {
                      f=1;
                      break;
                  }
              }
              if(f==0)
              {
                  if(ans>i-k+1)
                  {
                      ans=i-k+1;
                      str=s.substring(k,i+1);
                  }
                      while(k<i)
                      {
                          f=0;
                          a[s.charAt(k)-'a']--;
                          k++;
                      for(j=0;j<26;j++)
                         {
                          if(a[j]<b[j])
                            {
                               f=1;
                               break;
                             }
                         }
                         if(f==1)
                         break;
                         if(ans>i-k)
                         {
                             ans=i-k;
                              str=s.substring(k,i+1);
                         }
                       //  System.out.println(i+" "+k+" "+str);
                       }
              } 
          }
          if(ans==Integer.MAX_VALUE)
          return "-1";
          
          return str;
    }
    static void solve() {
     
        int n = sc.nextInt();
        int d = sc.nextInt();
        int k = sc.nextInt();
        int maxCount = 0, maxStart = 1, minStart = 1, minCount = Integer.MAX_VALUE, currentCount = 0;
        Map<Integer, Integer> startMap = new HashMap<>();
        Map<Integer, Integer> endMap = new HashMap<>();
        
        for (int i = 0; i < k; i++) {
            int start = sc.nextInt();
            int end = sc.nextInt();
            startMap.put(start, startMap.getOrDefault(start, 0) + 1);
            endMap.put(end, endMap.getOrDefault(end, 0) + 1);
        }

        for (int i = 1; i <= d; i++) {
            currentCount += startMap.getOrDefault(i, 0);
        }

        maxCount = currentCount;
        minCount = currentCount;

        for (int i = 2; i <= n - d + 1; i++) {
            currentCount -= endMap.getOrDefault(i - 1, 0);
            currentCount += startMap.getOrDefault(i + d - 1, 0);

            if (currentCount > maxCount) {
                maxCount = currentCount;
                maxStart = i;
            }

            if (currentCount < minCount) {
                minCount = currentCount;
                minStart = i;
            }
        }

        System.out.println(maxStart + " " + minStart);
    }
    
}

class FastIO extends PrintWriter {
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
