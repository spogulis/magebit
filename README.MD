Setup instructions
========================

# Instructions


1. Copy db dump to a folder of your choosing. While being in this folder, enter mysql command prompt (`mysql -uroot -p`) and enter the following commands to create and restore the database:
```
mysql -u root -p -e "create database magebit";
mysql -u root -p magebit < magebit.sql

```
2. Create a virtual host and set it's document root as `public/`
3. In `htdocs` folder perform `composer install` and `npm install` command to install dependencies
3. Open localhost (or custom hostname as set in webserver virtual host config) in your web browser to start the application.
4. In case there are file/folder permission issues, execute the following command to add all to :www-data group: `sudo chown -R :www-data .`

# Router endpoints:
* New subscription: `/subscribe`
* New subscription success page: `subscribed`
* List of subscriptions: `/subscriptons`

# License
GNU General Public License v3.0

# Author
Renārs Grebežs