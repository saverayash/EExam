import java.util.*;

public class AGT
{
    public static void main(String[] args)
    {
        ArrayList<Pair> d = new ArrayList<>();
        d.add(new Pair(4, 0));
        d.add(new Pair(2, 1));
        d.add(new Pair(2, 2));
        d.add(new Pair(1, 3));
        d.add(new Pair(1, 4));
        d.add(new Pair(0, 5));
        d.add(new Pair(0, 6));
        d.add(new Pair(0, 7));

        int [][] M = new int[d.size()][d.size()]; 

        while(true)
        {
            
            Collections.sort(d, (a, b) -> b.x - a.x);

            if(d.get(0).x >= d.size())
            {
                System.out.println("NOT Graphic");
                break;
            }

            if(d.get(0).x > 0)
            {
               
                int degree = d.get(0).x;
                int vertex = d.get(0).y;

               
                d.get(0).x = 0;

                for(int i = 1; i <= degree; i++)
                {
                    int neighbor = d.get(i).y;

            
                    M[vertex][neighbor]++;
                    M[neighbor][vertex]++;

                  
                    d.get(i).x -= 1;
                }
            }
            else
            {
                if(d.get(d.size() - 1).x < 0)
                    System.out.println("NOT Graphic");
                else
                {
                    for(int i=0;i<d.size();i++)
                    {
                        for(int j=0;j<d.size();j++)
                        System.out.print(M[i][j]+" ");
                        System.out.println();
                    }
                   
                }
                break;
            }
        } 
    }
}

class Pair
{
    int x;
    int y;

    Pair(int x, int y)
    {
        this.x = x;
        this.y = y;
    }
}
