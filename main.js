/* Moralis init code */
const serverUrl = "https://mvcqongwpazm.usemoralis.com:2053/server";
const appId = "QXHvqxqxyVp2Y8tXGDFZfRIoXGgEEjk3w0CPMD6f";

const TOKEN_CONTRACT_ADDRESS = "0x1CDD3E1F97aBB288716F07FFecD12d16A57392Ca";


Moralis.start({ serverUrl, appId });

/* TODO: Add Moralis Authentication code */
init = async ()  => {
    hideElement(userInfo);
    hideElement(createItemForm);
    window.web3 = await Moralis.Web3.enable();
    window.tokenContract = new web3.eth.Contract(tokenContractAbi, TOKEN_CONTRACT_ADDRESS);
    initUser();
}

initUser = async () => {
    if(await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
        showElement(openCreateItemButton);
    }else{
        hideElement(userProfileButton);
        showElement(userConnectButton);
        hideElement(openCreateItemButton);
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

createItem = async () => {
    if(createItemFile.files.length == 0){
        alert("Please select a file");
        return;
    } else if(createItemNameField.value.length == 0){
        alert("Please give the item a name!");
        return;
    }

    const nftFile = new Moralis.File("nftFile.jpg", createItemFile.files[0]);
    await nftFile.saveIPFS();

    const nftFilePath = nftFile.ipfs();
    const nftFileHash = nftFile.hash();

    console.log(nftFilePath, nftFileHash);

    const metadata = {
        name: createItemNameField.value,
        description: createItemDescriptionField.value,
        image: nftFilePath,
    };

    const nftFileMetadataFile = new Moralis.File("metadata.json", {base64: btoa(JSON.stringify(metadata))});
    await nftFileMetadataFile.saveIPFS();

    const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
    const nftFileMetadataFileHash = nftFileMetadataFile.hash();

    const nftId = await mintNft(nftFileMetadataFilePath);
    const Item = Moralis.Object.extend("Item");

    const item = new Item();
    item.set('name', createItemNameField.value)
    item.set('description', createItemDescriptionField.value);
    item.set('nftFilePath', nftFilePath);
    item.set('nftFileHash', nftFileHash);
    item.set('metadataFilePath', nftFileMetadataFilePath);
    item.set('metadataFileHash', nftFileMetadataFileHash);
    item.set('nftId', nftId);
    item.set('nftContractAddress', TOKEN_CONTRACT_ADDRESS);
    await item.save();
    console.log(item);
}

mintNft = async (metadataUrl) => {
    console.log('inside mintNFT');
    const receipt = await tokenContract.methods.createItem(metadataUrl).send({from: ethereum.selectedAddress});
    
    console.log('inside mintNFT-2');
    console.log(receipt);

    return receipt.events.Transfer.returnValues.tokenId;
}
hideElement = (element) => element.style.display  = "none";
showElement = (element) => element.style.display  = "block";

// Nav bar
const userConnectButton = document.getElementById("btn-login");
userConnectButton.onclick = login;

const userProfileButton = document.getElementById("btn-userInfo");
userProfileButton.onclick = openUserInfo;

const openCreateItemButton = document.getElementById("btnOpenCreateItem");
openCreateItemButton.onclick = () => showElement(createItemForm);

// User profile
const userInfo = document.getElementById("userInfo");
const userUsername = document.getElementById("txt-username");
const userEmail = document.getElementById("txt-email");
const userAvatarImg = document.getElementById("imgAvatar");
const userAvatarFile = document.getElementById("fileAvatar");

const userSaveInfoButton = document.getElementById("btn-saveUserInfo"); userSaveInfoButton.onclick = saveUserInfo;
document.getElementById("btn-closeUserInfo").onclick = () => hideElement(userInfo);
document.getElementById("btn-logout").onclick = logout;

// Item creation
const createItemForm = document.getElementById("createItem");
const createItemNameField = document.getElementById("txtCreateItemName");
const createItemDescriptionField = document.getElementById("txtCreateItemDescription");
const createItemPriceField = document.getElementById("numCreateItemPrice");
const createItemStatusField = document.getElementById("selectCreateItemStatus");
const createItemFile = document.getElementById("fileCreateItemFile");

document.getElementById("btnSaveCreateItem").onclick = () => createItem();
document.getElementById("btnCloseCreateItem").onclick = () => hideElement(createItemForm);

init();