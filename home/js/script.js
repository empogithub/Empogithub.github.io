var navigationItems = [
    {
        name: "Home",
        href: "/home",
        icon: "fas fa-home",
    },
    {
        name: "Hodinium",
        href: "https://github.com/empogithub/Hodinium",
        icon: "fa-solid fa-circle-xmark",
    },
    {
        name: "nodel",
        href: "https://github.com/empogithub/nodel",
        icon: "fa-solid fa-square-virus",
    },
    {
        name: "webit",
        href: "https://webitdownload.sourceforge.io/",
        icon: "fa-solid fa-file",
    },
    {
        name: "Keygen98",
        href: "https://github.com/empogithub/Keygen98",
        icon: "fa-solid fa-key",
    },
    {
        name: "666devil",
        href: "https://github.com/empogithub/666devil",
        icon: "fa-solid fa-book-skull",
    },
    {
        name: "gpt-surf",
        href: "/gptsurf",
        icon: "fa-solid fa-gamepad",
    },
    {
        name: "comming soon",
        href: "/home",
        icon: "fas fa-cogs",
    },
    {
        name: "comming soon",
        href: "/home",
        icon: "fas fa-cogs",
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
