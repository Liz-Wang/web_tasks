用python来实现对豆瓣网站的爬虫，并把图片保存到本地。
利用python的urllib库，其中调用urlopen方法，返回一个request对象，调用read方法来获得返回得到的网页内容。
设置路径，为了使得爬虫更顺利，打开豆瓣的网页按F12键->network->中获得User-Agent来伪装成浏览器访问。
利用re.findall以列表的形式返回能匹配的字符串。并打印各个图片的地址。

