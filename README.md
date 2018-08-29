# puppeteer

## install

仅在测试环境下：
mac 下请安装pdftk：
https://www.pdflabs.com/tools/pdftk-server/
mac 高版本请使用：
https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk_server-2.02-mac_osx-10.11-setup.pkg

## run

```
docker pull wenlonghuo/puppeteer-pdf:1.0.0
docker run -i -t -p 19898:19898 --privileged=true wenlonghuo/puppeteer-pdf:1.0.0
docker run -i -t -p 19898:19898 --restart=always --privileged=true wenlonghuo/puppeteer-pdf:1.0.0
```

## 清理
```
docker system prune
```

命令可以用于清理磁盘，删除关闭的容器、无用的数据卷和网络，以及dangling镜像（即无tag的镜像）。

```
docker system prune -a
```

命令清理得更加彻底，可以将没有容器使用Docker镜像都删掉。注意，这两个命令会把你暂时关闭的容器，以及暂时没有用到的Docker镜像都删掉了……所以使用之前一定要想清楚吶。
