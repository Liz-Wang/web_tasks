#include <iostream>
using namespace std;

void fibonacci(){
	double a[100];
	int i,;
	a[0]=1;
	a[1]=1;
	cout<<"Fibonacci数列前100项数如下"<<endl; 
	cout<<"第1项为 1"<<endl;
    cout<<"第2项为 1"<<endl;
	for(i=2;i<100;i++) 
	{ 
		a[i]=a[i-1]+a[i-2];
		cout<<"第"<<i+1<<"项是 " ;
		cout<<a[i]<<endl;
	}
}
int main(){
	fibonacci();
	return 0;
}
