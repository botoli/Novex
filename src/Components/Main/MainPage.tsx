// MainPage.tsx
import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import Hero from "./Hero";
import ProjectsPage from "./ProjectsPage";
import style from "../../style/Main/MainPage.module.scss";

type Page = "main" | "projects";

function MainPage() {
  const [currentPage, setCurrentPage] = useState<Page>("main");

  const handleProjectClick = (projectId: number) => {
    console.log("Открыть проект:", projectId);
    // Здесь можно добавить логику для открытия страницы проекта
    // Например: setCurrentPage('project-detail');
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "projects":
        return <ProjectsPage onProjectClick={handleProjectClick} />;
      case "main":
      default:
        return (
          <div className={style.contentColumn}>
            <Hero onNavigateToProjects={() => setCurrentPage("projects")} />
          </div>
        );
    }
  };

  return (
    <div className={style.mainContainer}>
      <div className={style.leftPanelContainer}>
        <LeftPanel onPageChange={handlePageChange} currentPage={currentPage} />
      </div>
      <div className={style.contentContainer}>{renderContent()}</div>
    </div>
  );
}

export default MainPage;
