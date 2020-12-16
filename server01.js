var express = require("express")
var app = express()
var path = require("path")
var bodyParser = require("body-parser")
const PORT = 3000;

app.use(express.static('static'))

let users = [
    { id: 1, login: "goryl", password: "111", age: 13, student: "on", gender: "mężczyzna" },
    { id: 2, login: "alfons", password: "222", age: 11, student: "", gender: "kobieta" },
    { id: 3, login: "karol", password: "333", age: 17, student: "", gender: "mężczyzna" },
    { id: 4, login: "judasz", password: "444", age: 13, student: "on", gender: "mężczyzna" },
    { id: 5, login: "asia", password: "555", age: 14, student: "on", gender: "kobieta" },
    { id: 6, login: "basia", password: "555", age: 14, student: "on", gender: "kobieta" }
]

let logged = false

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"))
})
app.get("/main", function (req, res) {
    res.redirect("/")
    console.log(__dirname)
})
app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"))
    console.log(__dirname)
})
app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"))
    console.log(__dirname)
})
app.get("/admin", function (req, res) {
    if (logged == false) {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/adminOn.html"))
    }
    console.log(__dirname)
})
app.get("/logout", function (req, res) {
    logged = false
    res.redirect("/")
})

app.use(bodyParser.urlencoded({ extended: true }));
app.post("/registerForm", function (req, res) {
    let userExist = true
    for (i = 0; i < users.length; i++) {
        if (users[i].login == req.body.login) {
            userExist = false
        }
    }
    if (userExist == true) {
        res.send("Zarejestrowano użytkownika: " + req.body.login)
        let newObject = {}
        newObject.id = users.length + 1
        newObject.login = req.body.login
        newObject.password = req.body.password
        newObject.age = parseInt(req.body.age)
        if (req.body.student == "on") {
            newObject.student = req.body.student
        } else {
            newObject.student = ""
        }
        newObject.gender = req.body.gender
        users.push(newObject)
        console.log(users)
    } else {
        res.send("Użytkownik już istnieje")
    }
})
app.get("/loginForm", function (req, res) {
    for (i = 0; i < users.length; i++) {
        if (req.query.login == users[i].login && req.query.password == users[i].password) {
            logged = true
        }
    }
    if (logged == true) {
        res.redirect("/admin")
    } else {
        res.send("Błędne dane logowania")
    }
    console.log(req.query)
})
app.get("/sort", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/sort.html"));
    if (logged == true) {
        let sorted = []
        for (i = 0; i < users.length; i++) {
            sorted.push(users[i])
        }
        let webString =
            `<head>
    <title>sort</title>
    <link rel='stylesheet' href='css/styleTable.css'>
    <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@1,300&display=swap" rel="stylesheet">
</head>

<body>
    <ul>
        <li>
            <a href="sort">sort</a>
        </li>
        <li>
            <a href="gender">gender</a>
        </li>
        <li>
            <a href="show">show</a>
        </li>
    </ul>
    <form class="sort" action="/sortForm" method="GET" onchange="this.submit()">
        <label for="sort">rosnąco</label>
        <input type="radio" name="sort" value="increase">
        <label for="sort">malejąco</label>
        <input type="radio" name="sort" value="decrease">
    </form>
    <table>`;
        for (i = 0; i < sorted.length; i++) {
            webString = webString + `<tr>
            <td>id: ${users[i].id}</td>
            <td>user: ${users[i].login} - ${users[i].password}</td>
            <td>wiek: ${users[i].age}</td></tr>`
        }
        webString = webString + "</table></body>"
        res.send(webString)
    } else {
        res.redirect("/admin")
    }
})
app.get("/sortForm", function (req, res) {
    let sortedUsers = []
    for (i = 0; i < users.length; i++) {
        sortedUsers.push(users[i])
    }
    if (req.query.sort == "increase") {
        sortedUsers.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        })
    }
    else {
        sortedUsers.sort(function (a, b) {
            return parseFloat(b.age) - parseFloat(a.age);
        })
    }
    webString = `<head>
    <title>sort</title>
    <link rel='stylesheet' href='css/styleTable.css'>
    <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@1,300&display=swap" rel="stylesheet">
</head>

<body>
    <ul>
        <li>
            <a href="sort">sort</a>
        </li>
        <li>
            <a href="gender">gender</a>
        </li>
        <li>
            <a href="show">show</a>
        </li>
    </ul>
    <form class="sort" action="/sortForm" method="GET" onchange="this.submit()">
        <label for="sort">rosnąco</label>
        <input type="radio" name="sort" value="increase">
        <label for="sort">malejąco</label>
        <input type="radio" name="sort" value="decrease">
    </form>
    <table>`;
    for (i = 0; i < sortedUsers.length; i++) {
        webString = webString + `<tr>
            <td>id: ${sortedUsers[i].id}</td>
            <td>user: ${sortedUsers[i].login} - ${sortedUsers[i].password}</td>
            <td>wiek: ${sortedUsers[i].age}</td></tr>`
    }
    webString = webString + "</table></body>"
    res.send(webString)
})
app.get("/show", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/gender.html"));
    if (logged == true) {
        let sorted = []
        for (i = 0; i < users.length; i++) {
            sorted.push(users[i])
        }
        let webString =
            `<head>
    <title>sort</title>
    <link rel='stylesheet' href='css/styleTable.css'>
    <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@1,300&display=swap" rel="stylesheet">
</head>

<body>
    <ul>
        <li>
            <a href="sort">sort</a>
        </li>
        <li>
            <a href="gender">gender</a>
        </li>
        <li>
            <a href="show">show</a>
        </li>
    </ul>
    <table>`;
        for (i = 0; i < sorted.length; i++) {
            if (users[i].student == "on") {
                webString = webString + `<tr>
            <td>id: ${users[i].id}</td>
            <td>user: ${users[i].login} - ${users[i].password}</td>
            <td>uczeń:   <input type="checkbox" checked disabled></td>
            <td>wiek: ${users[i].age}</td>
            <td>płeć: ${users[i].gender}</td></tr>`
            } else {
                webString = webString + `<tr>
            <td>id: ${users[i].id}</td>
            <td>user: ${users[i].login} - ${users[i].password}</td>
            <td>uczeń: <input type="checkbox" disabled></td>
            <td>wiek: ${users[i].age}</td>
            <td>płeć: ${users[i].gender}</td></tr>`
            }
        }
        webString = webString + "</table></body>"
        res.send(webString)
    } else {
        res.redirect("/admin")
    }
})
app.get("/gender", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/gender.html"));
    if (logged == true) {
        let sorted = []
        for (i = 0; i < users.length; i++) {
            sorted.push(users[i])
        }
        let webString =
            `<head>
    <title>sort</title>
    <link rel='stylesheet' href='css/styleTable.css'>
    <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@1,300&display=swap" rel="stylesheet">
</head>

<body>
    <ul>
        <li>
            <a href="sort">sort</a>
        </li>
        <li>
            <a href="gender">gender</a>
        </li>
        <li>
            <a href="show">show</a>
        </li>
    </ul>
    <table>`;
        for (i = 0; i < sorted.length; i++) {
            if (users[i].gender == "kobieta") {
                webString = webString + `<tr>
            <td>id: ${users[i].id}</td>
            <td>płeć: ${users[i].gender}</td></tr>`
            }
        }
        webString = webString + "</table></br><table>"
        for (i = 0; i < sorted.length; i++) {
            if (users[i].gender == "mężczyzna") {
                webString = webString + `<tr>
            <td>id: ${users[i].id}</td>
            <td>płeć: ${users[i].gender}</td></tr>`
            }
        }
        webString = webString + "</table></body>"
        res.send(webString)
    } else {
        res.redirect("/admin")
    }
})
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})