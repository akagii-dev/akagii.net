---
title: 'Proxyサーバー構築'
date: '2023/01/05'
image: posts/proxy server.png
categories: ['Tech']
description: 'Proxyサーバー構築の方法'
---

## 目次

## 環境
**OS: Ubuntu 22.04**

## Squid
### Squidのインストールとポートの開放
squidとufwを入れます
```
$sudo apt install squid ufw
```
次にポート開放をします
```
$sudo ufw allow 3128 
```

### Squidの設定
```
$sudo nano /etc/squid/squid.conf
```
でsquidの設定値を開いて
```
http_access deny *
```
の部分を**全て**コメントアウトして(*は!safe_portsなど)、
```
acl all src 0.0.0.0/0
http_access allow all
```
と書く

これでSquidの設定はおしまい

## Tailscale
### Tailscaleのインストール
[Tailscale](https://login.tailscale.com)でアカウントを作成して、
```
curl -fsSL https://tailscale.com/install.sh | sh
```

## クライアント側の設定
[Tailscaleをダウンロード](https://tailscale.com/download/)して、Chromeなどで使用する場合は[SwitchyOmega](https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif)を使用する。</br>
この場合、設定画面のServerはSquidを設定したPCのTailscaleのIPアドレスまたは`Machine name`を、Portには3128をする。