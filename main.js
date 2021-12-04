/* Moralis init code */
const serverUrl = "https://mvcqongwpazm.usemoralis.com:2053/server";
const appId = "QXHvqxqxyVp2Y8tXGDFZfRIoXGgEEjk3w0CPMD6f";
Moralis.start({ serverUrl, appId });

/* TODO: Add Moralis Authentication code */
init = async ()  => {
    hideElement(userInfo);
    window.web3 = await Moralis.Web3.enable();
    initUser();
}

initUser = async () => {
    if(await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
    }else{
        hideElement(userProfileButton);
        showElement(userConnectButton);
    }
}

login = async () => {
    try {
        await Moralis.Web3.authenticate();
        initUser();
    } catch (err) {
        alert(err);
    }
}

logout = async () => {
    await Moralis.User.logOut();
    hideElement(userInfo);
    initUser();
}

openUserInfo = async () => {
    user = await Moralis.User.current();
    if(user){
        showElement(userInfo);
    }else{
        login();
    }
}

hideElement = (element) => element.style.display  = "none";
showElement = (element) => element.style.display  = "block";

const userConnectButton = document.getElementById("btn-login");
userConnectButton.onclick = login;
const userProfileButton = document.getElementById("btn-userinfo");
userProfileButton.onclick = openUserInfo;

const userInfo = document.getElementById("userInfo");
document.getElementById("btn-closeUserInfo").onclick = () => hideElement(userInfo);
init();