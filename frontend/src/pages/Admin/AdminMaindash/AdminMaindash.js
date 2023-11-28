import React from "react";
import styled from "styled-components";
import AdminCards from "../AdminCards/AdminCards";
import Tables from "../Tables";
import ExpenseTable from "../ExpenseTable";
import PurchaseTable from "../PurchaseTable";

const AdminMaindash = () => {
  return (
    <AdminMaindashContainer>
      <div className="MainDash">
        <h5>Dashboard</h5>
        <ScrollableContent>
          <AdminCards/>
          <Tables />
          <ExpenseTable/>
          <PurchaseTable/>
        </ScrollableContent>
      </div>
    </AdminMaindashContainer>
  );
};
const AdminMaindashContainer = styled.div`
  .MainDash {
    padding-top: 1rem;   
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  @media screen and (max-width: 1200px) {
    .MainDash {
      justify-content: flex-start;
      margin-top: 2rem;
    }
  }

  @media screen and (max-width: 768px) {
    .MainDash {
      align-items: center;
    }
  }
  @media screen and (max-width: 511px) {
    .MainDash {
      align-items: center;
      margin-left: 22px;
    }
  }
  @media screen and (max-width: 503px) {
    .MainDash {
      align-items: center;
      margin-left: 26px;
    }
  }
  @media screen and (max-width: 488px) {
    .MainDash {
      align-items: center;
      margin-left: 28px;
    }
  }
  @media screen and (max-width: 485px) {
    .MainDash {
      align-items: center;
      margin-left: 30px;
    }
  }
  @media screen and (max-width: 478px) {
    .MainDash {
      align-items: center;
      margin-left: 36px
    }
  }
  @media screen and (max-width: 476px) {
    .MainDash {
      align-items: center;
      margin-left: 39px
    }
  }
  @media screen and (max-width: 472px) {
    .MainDash {
      align-items: center;
      margin-left: 42px
    }
  }
  @media screen and (max-width: 464px) {
    .MainDash {
      align-items: center;
      margin-left: 46px
    }
  }
  @media screen and (max-width: 462px) {
    .MainDash {
      align-items: center;
      margin-left: 48px
    }
  }
  @media screen and (max-width: 375px) {
    .MainDash {
      align-items: center;
      margin-left: 150px
    }
  }
  @media screen and (max-width: 414px) {
    .MainDash {
      align-items: center;
      margin-left: 120px
    }
  }
  @media screen and (max-width: 430px) {
    .MainDash {
      align-items: center;
      margin-left: 100px
    }
  }
  @media screen and (max-width: 360px) {
    .MainDash {
      align-items: center;
      margin-left: 160px
    }
  }
`;

const ScrollableContent = styled.div`
  overflow-y: scroll;
  max-height: 100%;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 6px; 
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(
      --your-scrollbar-color
    ); /* Set the color for the scrollbar thumb */
  }
  &::-webkit-scrollbar-track {
    background: transparent; /* Set the background for the scrollbar track */
  }
`;
export default AdminMaindash;
