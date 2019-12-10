const profile = document.querySelector('.profile');

const placesList = document.querySelector('.places-list');

const buttonClose = document.querySelector('.popup__close');

const buttonCloseNew = document.querySelector('.popup__close-new');  

const placesCard = document.querySelector('.places-card');

const popupNew = document.querySelector('.popup__new'); 

const buttonAddNew = document.querySelector('.button-new'); 

const popupButton = document.querySelector('.popup__button');

const popupEdit = document.querySelector('.popup__edit'); 

const popupAvatar = document.querySelector('.popup__avatar'); 

const editAvatar = document.querySelector('.button-avatar');

const editProfile = document.querySelector('.button-edit');

const buttonCloseEdit = document.querySelector('.popup__close-edit');  

const img = document.createElement('img');

const popupImg = document.querySelector('.popup__img'); 

const popupArea = document.querySelector('.popup__area');

const buttonCloseImg = document.querySelector('.popup__close-img');  

const userName = document.querySelector('.user-info__name'); 

const userJob = document.querySelector('.user-info__job'); 

const userId = document.querySelector('.user-info__id'); 

let userInfo = {};

const userAvatar = document.querySelector('.user-info__photo'); 

const editName = document.querySelector('.edit__name'); 

const editJob = document.querySelector('.edit__job');

const buttonNew = document.querySelector('.popup__button-new'); 

const buttonEdit = document.querySelector('.popup__button-edit');

const buttonAvatar = document.querySelector('.popup__button-avatar'); 

const form = document.forms.new;

const formEdit = document.forms.edit;

const formAvatar = document.forms.avatar;

const input = document.querySelector('.popup__input'); 

const inputNew1 = document.querySelector('.popup__input-new1');

const inputNew2 = document.querySelector('.popup__input-new2');

const inputEdit1 = document.querySelector('.popup__input-edit1');

const inputEdit2 = document.querySelector('.popup__input-edit2');

const inputAvatar = document.querySelector('.popup__input-avatar');

const inputNameImg = form.elements.nameImg;

const inputLink = form.elements.link;

const inputName = formEdit.elements.name;

const inputJob = formEdit.elements.job;

const inputLinkAvatar = formAvatar.elements.link;

const errorMessage = document.querySelector('.error-message');

const partOfLink = /(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?/i;