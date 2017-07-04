
#导入所需的库
import urllib.request,socket,re,sys,os

#定义文件保存路径
filePath = "D:\\test"

def saveFile(path):
    #检测当前路径的有效性
    if not os.path.isdir(filePath):
        os.mkdir(filePath)
    #设置每个图片的路径
    pos = path.rindex('/')
    t = os.path.join(filePath,path[pos+1:])
    return t

# 网址
url = "https://www.douban.com/"
#headers是之前获取的网页
headers = {
              'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0 '                            'Chrome/51.0.2704.63 Safari/537.36'
           }
#伪装成浏览器
req = urllib.request.Request(url=url, headers=headers)
res = urllib.request.urlopen(req)
data = res.read()

for link,t in set(re.findall(r'(https:[^s]*?(jpg|png|gif))', str(data))):

    print(link)#打印相应的图片链接
    try:
        urllib.request.urlretrieve(link,saveFile(link))
    except:
        print('失败')