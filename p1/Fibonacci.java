package first;
import java.math.BigInteger; 

public class Fibonacci { 
	
		 public static void main(String[] args) {
			 BigInteger a[] = new BigInteger[100];
			  a[0]=new BigInteger("1");
			  a[1]=new BigInteger("1");
			  for (int i = 2; i < a.length; i++) {
			   a[i] = a[i - 1].add(a[i - 2]) ; }
			  int j;
			  System.out.println("쳲��������е�ǰ100��������ʾ��");
			  for (int i = 0; i < a.length; i++) {
				  j=i+1;
				  System.out.print("��"+ j +"����");
				  System.out.println(a[i]);
			  }
		 }
		 
}
