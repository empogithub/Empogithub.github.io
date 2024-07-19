var navigationItems = [
    {
        name: "Home",
        href: "/home",
        icon: "fas fa-home",
    },
    {
        name: "Hodinium",
        href: "https://github.com/empogithub/Hodinium",
        icon: "fas fa-music",
    },
    {
        name: "nodel",
        href: "https://github.com/empogithub/nodel",
        icon: "fas fa-volume-up",
    },
    {
        name: "comming soon",
        href: "empogithub.github.io/home",
        icon: "fas fa-trash-alt",
    },
    {
        name: "comming soon",
        href: "empogithub.github.io/home",
        icon: "fas fa-cogs",
    },
    {
        name: "comming soon",
        href: "empogithub.github.io/home",
        icon: "fab fa-windows",
    },
    {
        name: "comming soon",
        href: "empogithub.github.io/home",
        icon: "fas fa-dice-d6",
    },
    {
        name: "comming soon",
        href: "empogithub.github.io/home",
        icon: "fas fa-dice-d6",
    },
    {
        name: "comming soon",
        href: "empogithub.github.io/home",
        icon: "fas fa-paw",
    },
]


function createItem(item) {
    var i = document.createElement("i");
    i.className = item.icon;

    var icon = document.createElement("span");
    icon.className = "icon";
    icon.appendChild(i);

    var title = document.createElement("span");
    title.className = "title";
    title.title = item.name;
    title.innerHTML = item.name;

    var a = document.createElement("a");
    a.href = item.href;
    a.appendChild(icon);
    a.appendChild(title);

    var li = document.createElement("li");
    if (item.onclick) { li.addEventListener("click", item.onclick) };
    li.appendChild(a);

    var navigation = document.querySelector(".navigationContainer .navigation ul");
    navigation.appendChild(li);
}


navigationItems.forEach(item => { createItem(item); });
document.getElementsByClassName("toggle")[0].click();
