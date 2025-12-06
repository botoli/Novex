import React from "react";
import style from "../../style/Errors/NotFound404.module.scss";

function NotFound404() {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <h1 className={style.glitch} data-text="404">
          Ошибка 404
        </h1>
        <p className={style.subtitle}>Страница не существует</p>

        <a href="/" className={style.homeButton}>
          <span>Вернуться на главную</span>
          <svg className={style.arrow} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default NotFound404;
