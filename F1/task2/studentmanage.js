var _data = [],info_body,numReg = /^\d+$/;//存放页面的学生信息

String.prototype.trim = function() {   
	return this.replace(/(^\s*)|(\s*$)/g, "");    
}

//根据ID找到obj
function $(id){
	return document.getElementById(id);
}
//根据id找到学生
function getStudentById (id) {
	for(var i=0;i<_data.length;i++){
		if(_data[i].id == id){
			return _data[i];
		}
	}
	return null;
}
//学生对象
function Student(num,name,sex,grade,major){
	this.id = new Date().getTime();
	this.num = num ? num : null;
	this.name = name ? name : null;
	this.sex = sex ? sex : '0';
	this.grade = grade ? grade : '0';
	this.major = major ? major : '0';
}
//开始加载页面的时候就会执行的函数
window.onload=function(){
	var stu = JSON.parse(localStorage.getItem('stu')),stuArr=[];
	//如果localStorage.getItem('contrastdata')存在值，就先添加进数组里面
	if(stu){
		for(var i = 0;i<stu.length;i++)
		{
			stuArr.push(stu[i]);
			_data.push(stuArr[i]);
		}
	}
	showData(_data);
}
//增加学生
function addHandler(){
	var stu = JSON.parse(localStorage.getItem('stu')),stu1={},stuArr=[];
	//如果localStorage.getItem('stu')存在值，就先添加进数组里面
	if(stu){
		for(var i = 0;i<stu.length;i++)
		{
	   		stuArr.push(stu[i]);
		}
	}
	var stu1 = new Student();
	stu1.num = $('nNum').value.trim();
	stu1.name = $('nName').value.trim();
	stu1.sex = $('nSex').value.trim();
	stu1.grade = $('nGrade').value.trim();
	stu1.major = $('nMajor').value.trim();
	if(stu1.num!=''&&stu1.name!=''){
		if(valid(stu1)){
			_data.push(stu1);
			$('resetButton').click();//添加之后输入框清空
		}
		showData(_data);
		stuArr.push(stu1);
		localStorage.setItem('stu',JSON.stringify(stuArr));
	}
	else{
		alert("学号或姓名不能为空");
	}
}
//验证输入是否正确
function valid(student){
	if(student.num == ''){
		alert('学号不能为空！');
		return false;
	}
	if(student.name == ''){
		alert('用户名不能为空！');
		return false;
	}
	return true;
}
//删除方法
function delHandler(id){
	var stu = JSON.parse(localStorage.getItem('stu')),stuArr=[];
	//如果localStorage.getItem('contrastdata')存在值，就先添加进数组里面
	if(stu){
		for(var i = 0;i<stu.length;i++)
		{
	   		stuArr.push(stu[i]);
		}
	}
	if(confirm('真的要删除吗？')){
		var temp1 = [];
		var temp = [];
		for(var i=0;i<_data.length;i++){
			if(_data[i].id != id){
				temp.push(_data[i]);
				temp1.push(stuArr[i]);
			}
		}
		_data = temp;
		stuArr = temp1;
		showData(_data);
	}
	localStorage.setItem('stu',JSON.stringify(stuArr));
}
//查询方法
function search(num,name,sex,grade,major){
	//console.log(arguments);
	var temp = [];
	for(var i=0;i<_data.length;i++){
		if("" != num){
			if(_data[i].num != num){
				continue;
			}
		}
		if("" != name){
			if(_data[i].name != name){
				continue;
			}
		}
		if("" != sex){
			if(_data[i].sex != sex){
				continue;
			}
		}
		if("" != grade){
			if(_data[i].grade != grade){
				continue;
			}
		}
		if("" != major){
			if(_data[i].major != major){
				continue;
			}
		}
		temp.push(_data[i]);
	}
	showData(temp);
}
//根据数据显示内容（html代码生成）
function showData(data){
	info_body = info_body || $('info-body');
	var html = [];
	for(var i=0;i<data.length;i++){
		html.push('<tr>');
		html.push('<td>'+data[i].num+'</td>');
		html.push('<td>'+data[i].name+'</td>');
		html.push('<td>'+showSex(data[i].sex)+'</td>');
		html.push('<td>'+showGrade(data[i].grade)+'</td>');
		html.push('<td>'+showMajor(data[i].major)+'</td>');
		html.push('<td><button class="btn" style="margin-right:10px;" onclick="editHandler(this,\''+data[i].id+'\')">编辑</button><button class="btn btn-danger" style="margin-right:10px;" onclick="delHandler(\''+data[i].id+'\')">删除</button></td>');
		html.push('</tr>');
	}
	info_body.innerHTML = html.join("");
}

function showSex(v){
	if(v){
		if('0' == v){
			return '男';
		}else if('1' == v){
			return '女';
		}
	}
	return 'error';
}

function createSexTag(v){
	if('0' == v){
		return '<option value="0">男</option><option value="1">女</option>'; 
	}else{
		return '<option value="1">女</option><option value="0">男</option>';
	}
}
function showGrade(v){
	if(v){
		if('0' == v){
			return '14级';
		}
		if('1' == v){
			return '15级';
		}
		if('2' == v){
			return '16级';
		}
		if ('3' == v){
			return '17级';
		}

	}
	return 'error';
}

function createGradeTag(v){
	if('0' == v){
		return '<option value="0" >14级</option><option value="1">15级</option><option value="2">16级</option><option value="3">17级</option>'; 
	}
	if('1' == v) {
		return '<option value="1" >15级</option><option value="0">14级</option><option value="2">16级</option><option value="3">17级</option>';
	}
	if('2' == v){
		return '<option value="2" >16级</option><option value="0">14级</option><option value="1">15级</option><option value="3">17级</option>';
	}
	else {
		return '<option value="3" >17级</option><option value="0">14级</option><option value="1">15级</option><option value="2">16级</option>';
	}
}
function showMajor(v){
	if(v){
		if('0' == v){
			return '计算机科学与技术';
		}else if('1' == v){
			return '通信工程';
		}else{
			return '电子信息工程';
		}
	}
	return 'error';
}

function createMajorTag(v){
	if('0' == v){
		return '<option value="0" >计算机科学与技术</option><option value="1">通信工程</option><option value="2">电子信息工程</option>'; 
	}
	if('1' == v){
		return '<option value="1">通信工程</option><option value="0" >计算机科学与技术</option><option value="2">电子信息工程</option>';
	}
	else{
		return '<option value="2">电子信息工程</option><option value="0" >计算机科学与技术</option><option value="1">通信工程</option>';
	}
}
//保存修改内容
function saveEidted(id) {
	var stu = JSON.parse(localStorage.getItem('stu')),stu1={},stuArr=[];
	//如果localStorage.getItem('contrastdata')存在值，就先添加进数组里面
	if(stu){
		for(var i = 0;i<stu.length;i++)
		{
	   		stuArr.push(stu[i]);
		}
	}
	var stu1 = new Student();
	stu1.num = $('eNum').value;
	stu1.name = $('eName').value;
	stu1.sex = $('eSex').value;
	stu1.grade= $('eGrade').value;
	stu1.major = $('eMajor').value;
	if(valid(stu1)){
		for(var i=0;i<_data.length;i++){
			if(_data[i].id == id){
				_data[i] = stu1;
				stuArr[i] = stu1;
				showData(_data);
				localStorage.setItem('stu',JSON.stringify(stuArr));
				break;
			}
		}
	}
}
//编辑
function editHandler(obj,id){
	var pp = obj.parentNode.parentNode;
	var tds = pp.getElementsByTagName('td');
	var temp = getStudentById(id);
	if(null != temp){
		for(var i=0;i<tds.length;i++){
			if(0 == i){
				tds[i].innerHTML = '<input id="eNum" style="width:80px" type="text" value="'+temp.num+'">';
			}
			if(1 == i){
				tds[i].innerHTML = '<input id="eName" style="width:80px" type="text" value="'+temp.name+'">';
			}
			if(2 == i){
				tds[i].innerHTML = '<select id="eSex" style="width:60px;">'+createSexTag(temp.sex)+'</select>';	
			}
			if(3 == i){
				tds[i].innerHTML = '<select id="eGrade" style="width:60px;">'+createGradeTag(temp.grade)+'</select>';	
			}
			if(4 == i){
				tds[i].innerHTML = '<select id="eMajor" style="width:60px;">'+createMajorTag(temp.major)+'</select>';	
			}
			if(5 == i){
				tds[i].innerHTML = '<button class="btn" onclick="saveEidted(\''+id+'\')">保存</button> <button class="btn" onclick="showData(_data)">取消</button>';
			}
		}	
	}else{
		alert('error!');
	}
}


