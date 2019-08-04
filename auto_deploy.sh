#!/bin/bash

SITE_PATH='/var/www/sunflower-collection'
USER='root'
USERGROUP='root'

echo "start auto deployment ..."
cd $SITE_PATH

echo 'pull ...'
# 强制远程分支覆盖本地分支 & 撤销工作区untrack文件
git reset --hard origin/master && git clean -f
# 拉取代码 & 切换master 分支
git pull && git checkout master

# 分配用户组权限
chown -R $USER:$USERGROUP $SITE_PATH
# 重启服务进程
pm2 restart 4
echo "Finished ..."