#JSMCCC
=====

һ����Node.js��д��Minecraft����ģ��

## ��ģ����ŵ㣺

- ��������½��֤ģ�黯
- Java�Լ�ϵͳ��Ϣ��Ѱ��
- �Զ���Natives�ļ���ѹ
- һЩ���õĹ���

## ��Ȩ˵����

- ����ṹ������[MineStudio](https://github.com/MineStudio)��[KMCCC](https://github.com/MineStudio/KMCCC)��Ŀ
- ����Դ����Դ�ڻ�������[UUID](http://www.cnblogs.com/greengnn/archive/2011/10/06/2199719.html) [StringBuilder](http://blog.csdn.net/lynnlovemin/article/details/11476417) [Map](http://blog.sina.com.cn/s/blog_7e9c5b6801016oyz.html)
- ������[LGPLv2Э��](http://www.cnblogs.com/findumars/p/3556883.html)

## һЩ����~~����~~

���µ�`()`��ʾΪ`��ѡ����`��`[]`��ʾΪ`��ѡ����`

-----

## ����һ������������

```javascript

const LauncherCore=require('./core/LauncherCore.js');

var core=new LauncherCore([��Ϸ��Ŀ¼],[JAVA·��],[�汾������]);

```

## Ѱ�Ұ汾

```javascript

var versions=core.GetVersions();

var version=core.GetVersion('1.8');

```

## ������Ϸ

```javascript

const LauncherCore=require('./core/LauncherCore.js'),OfflineAuthenticator=require('./authentication/OfflineAuthenticator.js');
//const YggdrasilLogin=require('./authentication/Yggdrasil.js');    <-�����½��

var core=new LauncherCore();

core.Launch({
    Version:core.GetVersion('1.8.8'),//   <-����
    Authenticator:new OfflineAuthenticator('Steve'),//   <-����
    //Authenticator:new YggdrasilLogin('10000@qq.com','123456'),   <-�����½
	//MaxMemory:1024,   <-����ڴ�
	//MinMemory:512,    <-��С�ڴ�
	/*Server:{
        Address:'www.360.cn',
        Port:25565
    },   <-�Զ����������    */
	/*Size:{
        Height:768,
        Width:1280
    }    <-��Ϸ���ڴ�С      */
});

```

## ������Ϸ�������ü�����

```javascript

const LauncherCore=require('./core/LauncherCore.js'),OfflineAuthenticator=require('./authentication/OfflineAuthenticator.js');

var core=new LauncherCore();

core.Launch({
    Version:core.GetVersion('1.8.8'),
    Authenticator:new OfflineAuthenticator('Steve')
},data=>{
//����Log�¼�
},err=>{
//���մ����¼�
},exit=>{
//������Ϸ�˳��¼�
});

```

## ������Ϸ������ȡȱ�ٿ�

```javascript

const LauncherCore=require('./core/LauncherCore.js'),OfflineAuthenticator=require('./authentication/OfflineAuthenticator.js');

var core=new LauncherCore();

var re=core.Launch({
    Version:core.GetVersion('1.8.8'),
    Authenticator:new OfflineAuthenticator('Steve')
});

if(!re)console.log(re);//���ȱ�ٱر��Ŀ⣬���᷵��һ������

```

# Enjoy!
