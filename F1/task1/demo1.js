function login()
{
	var name = document.getElementById('uname');
	var password = document.getElementById('pwd');
	 if(/^\s*$/.test(name.value) || /^\s*$/.test(password.value)) {
	 	alert('用户名或密码不能为空');
        		return false;
    	 } 
    	 else if(name.value=='username' && password.value =='123456') {
        		alert('登录成功');
        		return true;
    	} 
    	else {
        		alert(' 用户名或密码不正确，点击“确定”继续编辑');
        		return false;
    	}  
}

function forpwd()
{
	alert('默认用户名为： username，默认密码为：123456'+'\n'+'其他情况请联系管理员');

}