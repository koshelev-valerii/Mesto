// Card
class Card {
  constructor(item) {
    this.item = item;
    this.id = this.id.bind(this);
    this.element = this.create(this.item);
    this.like = this.like.bind(this);
    this.remove = this.remove.bind(this);
    const like = this.element.querySelector('.place-card__like-icon');
    const remove = this.element.querySelector('.place-card__delete-icon');
    like.addEventListener('click', this.like);
    remove.addEventListener('click', this.remove);
  }

  id(item){
    let id = [];
    item.likes.forEach((item) => {id.push(item._id)});
    return id;
  }

  create(item){
    const placeCard = document.createElement('div'); //card
    placeCard.classList.add('place-card');
    placeCard.setAttribute('owner', item.owner._id);
    placeCard.setAttribute('id', item._id);

    const cardImage = document.createElement('div'); //image
    cardImage.classList.add('place-card__image');
    cardImage.setAttribute('style','background-image: url(' + item.link + ')');
    placeCard.appendChild(cardImage);

    const cardDeleteButton = document.createElement('button'); //button delete
    cardDeleteButton.classList.add('place-card__delete-icon');
    cardImage.appendChild(cardDeleteButton);
    if (placeCard.getAttribute('owner') == userId.textContent) {
      cardDeleteButton.classList.add('place-card__delete-icon-visible');
    }

    const cardDescription = document.createElement('div'); //card description
    cardDescription.classList.add('place-card__description');
    placeCard.appendChild(cardDescription);

    const cardName = document.createElement('h3'); //name
    cardName.classList.add('place-card__name');
    cardName.textContent = item.name;
    cardDescription.appendChild(cardName);

    const likeArea = document.createElement('div'); //likeArea
    likeArea.classList.add('place-card__like-area-icon');
    cardDescription.appendChild(likeArea);

    const likeButton = document.createElement('button'); //like
    likeButton.classList.add('place-card__like-icon');
    likeArea.appendChild(likeButton);
    if (this.id(item).includes(userId.textContent)){
      likeButton.classList.toggle('place-card__like-icon_liked');
    }

    const likeCounter = document.createElement('p'); //likeCounter
    likeCounter.classList.add('place-card__like-counter-icon');
    likeCounter.textContent = item.likes.length;
    likeArea.appendChild(likeCounter);

    return placeCard;
  }

  like(e) {
    if (this.id(this.item).includes(userId.textContent)){
      deleteLike(this.item, this.element);
    } else {
      sendLike(this.item, this.element);
    }
  }

  remove(e) {
    if (window.confirm("Вы действительно хотите удалить эту карточку?")) {
      if (e.target.parentNode.parentNode.getAttribute('owner') == userId.textContent) {
      removeCard(e.target.parentNode.parentNode.getAttribute('id'), e.target.parentNode.parentNode);
      } else {
        alert(`Этот пост не ваш =( \nМожно удалять только свои посты! =)`)
      }
    }
  }
}


// class CardList
class CardList {
  constructor(container, arr) {
    this.container = container;
    this.arr = arr;
    this.render(this.arr);
  }

  render(arr) {
    arr.forEach((item) => {
      this.addCard(item);
    })
  }

  addCard(item) {
    const card = new Card(item);
    this.container.appendChild(card.element);
  }
}
let newCardList = new CardList(placesList, []);


//______________________________________________________________________________      // Api


class Api {
  constructor(base) {
    this.baseUrl = base.baseUrl;
    this.headers = base.headers;
  }

  getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getInfo() {
    return fetch(this.baseUrl + '/users/me', {
      headers: this.headers
    })
    .then(res => this.getResponseData(res));
  }


  getInitialCards() {
    return fetch(this.baseUrl + '/cards', {
      headers: this.headers
    })
    .then(res => this.getResponseData(res));
  }

  editValue(editName, editJob) {
    return fetch(this.baseUrl + '/users/me', {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        name: editName,
        about: editJob
      })
    })
    .then(res => this.getResponseData(res));
  }

  postNewCard(nameCard, linkCard) {
    return fetch(this.baseUrl + '/cards', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name: nameCard,
        link: linkCard
      })
    })
    .then(res => this.getResponseData(res));
  }

  deleteCard(e) {
    return fetch(this.baseUrl + '/cards/' + e, {
      method: 'DELETE',
      headers: this.headers
    })
    .then(res => this.getResponseData(res));
  }

  editAvatar(avatarLink) {
    return fetch(this.baseUrl + '/users/me/avatar', {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        avatar: avatarLink,
      })
    })
    .then(res => this.getResponseData(res));
  }

  addLike(e) {
    return fetch(this.baseUrl + '/cards/like/' + e, {
      method: 'PUT',
      headers: this.headers
    })
    .then(res => this.getResponseData(res));
  }

  removeLike(e) {
    return fetch(this.baseUrl + '/cards/like/' + e, {
      method: 'DELETE',
      headers: this.headers
    })
    .then(res => this.getResponseData(res));
  }
}

const api = new Api({
  baseUrl: 'http://95.216.175.5/cohort5',
  headers: {
    authorization: '68faebcb-beb2-4907-bee1-5dbbe259c717',
    'Content-Type': 'application/json'
  }
});


api.getInfo()
  .then((result) => {
    userName.textContent = result.name;
    userJob.textContent = result.about;
    userId.textContent = result._id;
    userInfo = result;
    userAvatar.setAttribute('style','background-image: url(' + result.avatar + ')');
  })
  .catch((err) => console.log(err));


api.getInitialCards()
  .then((result) => {
    newCardList.render(result);
  })
  .catch((err) => console.log(err));

function renderLoading(isLoading, button) {
  if (isLoading) {
    button.textContent = 'Загрузка...';
  } else if (button == buttonNew) {
    button.textContent = '+';
  } else if (button == buttonEdit) {
    button.textContent = 'Сохранить';
  } else if (button == buttonAvatar) {
    button.textContent = 'Сохранить';
  }
};

function editFormValue(e) {
  e.preventDefault();
  renderLoading(true, buttonEdit);
  let Name = editName.value;
  let Job = editJob.value;
  api.editValue(Name, Job)
  .then((result) => {
    userName.textContent = result.name;
    userJob.textContent = result.about;
  })
  .catch((err) => console.log(err))
  .finally(() => {
    renderLoading(false, buttonEdit);
    popupEditProfile.close();
  });
  return e;
};
formEdit.addEventListener('submit', editFormValue);


function addNewCard(e) {
  e.preventDefault();
  renderLoading(true, buttonNew);
  let name = inputNameImg.value;
  let link = inputLink.value;
  api.postNewCard(name, link)
    .then((result) => {
      newCardList.render([result]);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(false, buttonNew);
      buttonNew.classList.add('popup__button-disable');
      buttonNew.setAttribute('disabled', true);
      popupNewCard.close();
    });
  return e;
};
form.addEventListener('submit', addNewCard);

function removeCard(idEl, el){
  api.deleteCard(idEl)
    .then((result) => {
      el.parentNode.removeChild(el);
    })
    .catch((err) => console.log(err));
}

function changeAvatar(e) {
  e.preventDefault();
  renderLoading(true, buttonAvatar);
  let link = inputLinkAvatar.value;
  api.editAvatar(link)
    .then((result) => {
      userAvatar.setAttribute('style','background-image: url(' + result.avatar + ')');
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(false, buttonAvatar);
      popupEditAvatar.close();
    });
  return e;
};
formAvatar.addEventListener('submit', changeAvatar);


function changeLike(el, result){
  el.querySelector('.place-card__like-counter-icon').textContent = result.likes.length;
  el.querySelector('.place-card__like-icon').classList.toggle('place-card__like-icon_liked');
}

function deleteLike(card, elem){
  api.removeLike(card._id)
    .then((result) => {
      changeLike(elem, result);
      card.likes.splice(card.likes.indexOf(userInfo), 1);
    })
    .catch((err) => console.log(err))
}
function sendLike(card, elem){
  api.addLike(card._id)
    .then((result) => {
      changeLike(elem, result);
      card.likes.push(userInfo);
    })
    .catch((err) => console.log(err))
}


//______________________________________________________________________________      // Popup


class Popup {
  constructor(element, openClassName) {
    this.element = element;
    this.openClassName = openClassName;
    const closeButton = this.element.querySelector('.popup__close');
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    closeButton.addEventListener('click', this.close);
  }

  open() {
    this.element.classList.add(this.openClassName);
  }

  close() {
    this.element.classList.remove(this.openClassName);
  }
}

class EditProfilePopup extends Popup {
  open() {
    renderLoading(false, buttonEdit);
    editName.setAttribute('value', userName.textContent);
    editJob.setAttribute('value', userJob.textContent);
    super.open();
  }

  close() {
    this.element.querySelector('.popup__form').reset();
    super.close();
  }
}

class NewCardPopup extends Popup {
  open() {
    renderLoading(false, buttonNew);
    super.open();
  }

  close() {
    this.element.querySelector('.popup__form').reset();
    buttonNew.classList.add('popup__button-disable');
    buttonNew.setAttribute('disabled', true);
    super.close();
  }
}

class ImgPopup extends Popup {
  open(e) {
    if (e.target.getAttribute('class') == 'place-card__image') {
      img.classList.add('area__img');
      const linkPhoto = e.target.style.backgroundImage;
      let link = linkPhoto.replace(/url\(\"/, '').replace(/"\)/, '');
      img.setAttribute('src', link);
      img.setAttribute('alt', '');
      popupArea.appendChild(img);
      super.open();
    }
  }
}

class EditAvatarPopup extends Popup {
  open() {
    renderLoading(false, buttonEdit);
    super.open();
  }

  close() {
    this.element.querySelector('.popup__form').reset();
    buttonAvatar.classList.add('popup__button-disable');
    buttonAvatar.setAttribute('disabled', true);
    super.close();
  }
}

const popupEditProfile = new EditProfilePopup(popupEdit, 'popup_is-opened');
const popupNewCard = new NewCardPopup(popupNew, 'popup_is-opened');
const popupImgCard = new ImgPopup(popupImg, 'popup_is-opened');
const popupEditAvatar = new EditAvatarPopup(popupAvatar, 'popup_is-opened');

buttonAddNew.addEventListener('click', popupNewCard.open);
editProfile.addEventListener('click', popupEditProfile.open);
editAvatar.addEventListener('click', popupEditAvatar.open);
document.addEventListener('click', popupImgCard.open);


//______________________________________________________________________________      // ValidAll


class Activator {
  constructor() {
    buttonNew.classList.add('popup__button-disable');
    buttonNew.setAttribute('disabled', true);
    buttonAvatar.classList.add('popup__button-disable');
    buttonAvatar.setAttribute('disabled', true);
    inputNew1.addEventListener('input', this.validFormNew);
    inputNew2.addEventListener('input', this.validFormNew);
    inputEdit1.addEventListener('input', this.validFormEdit);
    inputEdit2.addEventListener('input', this.validFormEdit);
    inputAvatar.addEventListener('input', this.validFormAvatar);
    inputNew1.addEventListener('input', this.checkValue);
    inputNew2.addEventListener('input', this.checkValue);
    inputEdit1.addEventListener('input', this.checkValue);
    inputEdit2.addEventListener('input', this.checkValue);
    inputAvatar.addEventListener('input', this.checkValue);
  }

  resetError(e) {
    e.parentNode.classList.remove('input-container__invalid');
    e.textContent = '';
  }

  activateError(e) {
    e.parentNode.classList.add('input-container__invalid');
  }

  activateButton(e) {
    e.classList.remove('popup__button-disable');
    e.removeAttribute('disabled');
  }

  disactivateButton(e) {
    e.classList.add('popup__button-disable');
    e.setAttribute('disabled', true);
  }
}

class ValidAll extends Activator {
  validFormNew() {
    if (inputNameImg.value.length <= 1 || !partOfLink.test(inputLink.value) || inputLink.value.length <= 1) {
        super.disactivateButton(buttonNew);
    } else if (inputNameImg.value.length >= 2 && inputLink.value.length >= 2 && partOfLink.test(inputLink.value)) {
        super.activateButton(buttonNew);
    }
  }

  validFormEdit() {
    if (inputName.value.length <= 1 || inputJob.value.length <= 1) {
        super.disactivateButton(buttonEdit);
    } else if (inputName.value.length >= 2 && inputJob.value.length >= 2) {
        super.activateButton(buttonEdit);
    }
  }

  validFormAvatar() {
    if (inputLinkAvatar.value.length <= 1 || !partOfLink.test(inputLinkAvatar.value)) {
        super.disactivateButton(buttonAvatar);
    } else if (inputLinkAvatar.value.length >= 2 && partOfLink.test(inputLinkAvatar.value)) {
        super.activateButton(buttonAvatar);
    }
  }

  checkValue(e) {
    super.resetError(e.target);
    const errorElement = document.querySelector(`#error-${e.target.id}`);
    if (e.target.value.length == 0) {
      errorElement.textContent = 'Это обязательное поле';
      super.activateError(errorElement);
      return false;
    } else if (e.target.type == 'url' && !partOfLink.test(inputLink.value) && !partOfLink.test(inputLinkAvatar.value)) {
      errorElement.textContent = 'Здесь должна быть ссылка';
      super.activateError(errorElement);
      return false;
    } else if (e.target.type == 'url') {
        return true;
    } else if (e.target.type != 'url' && e.target.value.length == 1 || e.target.value.length >= 31) {
        errorElement.textContent = 'Должно быть от 2 до 30 символов';
        super.activateError(errorElement);
        return false;
    }
    return true;
  }


}

new ValidAll();

//______________________________________________________________________________