import './style.css';

import {editFormValue,
        addNewCard,
        changeAvatar,
        popupEditProfile,
        popupNewCard,
        popupImgCard,
        popupEditAvatar,
        ValidAll
} from './js/script';

import {buttonAddNew,
        editAvatar,
        editProfile,
        form,
        formEdit,
        formAvatar
} from './js/constants';

formEdit.addEventListener('submit', editFormValue);
form.addEventListener('submit', addNewCard);
formAvatar.addEventListener('submit', changeAvatar);

buttonAddNew.addEventListener('click', popupNewCard.open);
editProfile.addEventListener('click', popupEditProfile.open);
editAvatar.addEventListener('click', popupEditAvatar.open);
document.addEventListener('click', popupImgCard.open);

new ValidAll();