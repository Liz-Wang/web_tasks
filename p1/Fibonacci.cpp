#include <iostream>
using namespace std;

void fibonacci(){
	double a[100];
	int i,;
	a[0]=1;
	a[1]=1;
	cout<<"Fibonacci����ǰ100��������"<<endl; 
	cout<<"��1��Ϊ 1"<<endl;
    cout<<"��2��Ϊ 1"<<endl;
	for(i=2;i<100;i++) 
	{ 
		a[i]=a[i-1]+a[i-2];
		cout<<"��"<<i+1<<"���� " ;
		cout<<a[i]<<endl;
	}
}
int main(){
	fibonacci();
	return 0;
}
