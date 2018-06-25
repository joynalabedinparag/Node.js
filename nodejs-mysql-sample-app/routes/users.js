/*
 * GET user login.
 */
exports.login = function(req, res) {
    var failed = req.params.failed; /* @TODO : Remove */
    res.render('users/login',{page_title:"Login", failed : failed});
};

/*
 * POST user login check.
 */
exports.loginCheck = function(req, res){

    var input = JSON.parse(JSON.stringify(req.body));
    var email = input.email;
    var password = input.password;

    req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM users WHERE email = ? AND password = ? ORDER BY `id` ASC LIMIT 1',[email, password],function(err,rows)
        {
            // console.log(query.sql);
            console.log(rows);
            if(err) {
                console.log("Error Selecting : %s ", err);

            } else {

                req.session.user_id = rows.id;
                req.session.email = rows.email;
                req.session.name = rows.name;

                console.log(req.session);
                if(rows.length)
                    res.redirect('/customers');
                else
                    res.redirect('/login?failed=true');
            }
        });

        //console.log(query.sql);
    });
};


/*
 * GET users listing.
 */
exports.list = function(req, res) {

    req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM users',function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('users',{page_title:"Users - Node.js",data:rows});

        });

        //console.log(query.sql);
    });

};
