/* Moralis init code */
const serverUrl = "https://mvcqongwpazm.usemoralis.com:2053/server";
const appId = "QXHvqxqxyVp2Y8tXGDFZfRIoXGgEEjk3w0CPMD6f";
Moralis.start({ serverUrl, appId });

/* TODO: Add Moralis Authentication code */
init = async ()  => {
    hideElement(userInfo);
    window.web3 = await Moralis.enableWeb3();
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
        const email = user.get("email");
        if(email){
            userEmail.value = email;
        }
        else{
            userEmail.value = "";
        }
        userUsername.value = user.get('username');
        const userAvatar = user.get('avatar');
        if(userAvatar)
        {
            userAvatarImg.src = userAvatar.url();
            showElement(userAvatarImg);
        }
        else
        {
            hideElement(userAvatarImg);
        }
        showElement(userInfo);
    }else{
        login();
    }
}

saveUserInfo = async () => {
    user.set("email", userEmail.value);
    user.set("username", userUsername.value);
    // const fileUploadControl = $("#profilePhotoFileUpload")[0];

    if (userAvatarFile.files.length > 0) {
        const file = userAvatarFile.files[0];
        const name = "avatar.jpg";
        const avatar = new Moralis.File(name, file);
        user.set('avatar', avatar);
    }
    await user.save();
    alert('User info saved successfully!!');
    openUserInfo();
}

hideElement = (element) => element.style.display  = "none";
showElement = (element) => element.style.display  = "block";

const userConnectButton = document.getElementById("btn-login");
userConnectButton.onclick = login;
const userProfileButton = document.getElementById("btn-userInfo");
userProfileButton.onclick = openUserInfo;

const userInfo = document.getElementById("userInfo");
const userUsername = document.getElementById("txt-username");
const userEmail = document.getElementById("txt-email");
const userAvatarImg = document.getElementById("imgAvatar");
const userAvatarFile = document.getElementById("fileAvatar");

const userSaveInfoButton = document.getElementById("btn-saveUserInfo"); userSaveInfoButton.onclick = saveUserInfo;
document.getElementById("btn-closeUserInfo").onclick = () => hideElement(userInfo);
document.getElementById("btn-logout").onclick = logout;
init();