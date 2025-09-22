import React, { createContext, useState } from "react";

export const TripsContext = createContext();

export const TripsProvider = ({ children }) => {
  const [trips, setTrips] = useState([
    {
      id: "1",
      destination: "도쿄",
      countryCode: "JP",
      travelPeriod: "2024-01-15 ~ 2024-01-20",
      budget: "2000000",
      memo: "첫 일본 여행! 스시와 온천을 체험하고 싶어요.",
      expenses: [
        {
          id: "1",
          category: "숙박",
          amount: 800000,
          description: "신주쿠 호텔 5박",
          location: "신주쿠",
          date: "2024-01-15"
        },
        {
          id: "2",
          category: "교통",
          amount: 150000,
          description: "JR 패스 7일권",
          location: "도쿄",
          date: "2024-01-15"
        },
        {
          id: "3",
          category: "식사",
          amount: 300000,
          description: "스시 오마카세",
          location: "긴자",
          date: "2024-01-16"
        },
        {
          id: "4",
          category: "관광",
          amount: 200000,
          description: "도쿄 스카이트리 입장권",
          location: "스미다",
          date: "2024-01-17"
        }
      ],
      totalSpent: 1450000,
      isCompleted: false
    },
    {
      id: "2",
      destination: "파리",
      countryCode: "FR",
      travelPeriod: "2024-02-10 ~ 2024-02-17",
      budget: "3000000",
      memo: "로맨틱한 파리 여행. 에펠탑과 루브르 박물관 필수!",
      expenses: [
        {
          id: "5",
          category: "숙박",
          amount: 1200000,
          description: "몽마르트 호텔 7박",
          location: "몽마르트",
          date: "2024-02-10"
        },
        {
          id: "6",
          category: "교통",
          amount: 200000,
          description: "파리 메트로 패스",
          location: "파리",
          date: "2024-02-10"
        },
        {
          id: "7",
          category: "식사",
          amount: 500000,
          description: "프랑스 레스토랑",
          location: "생제르맹",
          date: "2024-02-12"
        }
      ],
      totalSpent: 1900000,
      isCompleted: false
    },
    {
      id: "3",
      destination: "제주도",
      countryCode: "KR",
      travelPeriod: "2024-03-05 ~ 2024-03-08",
      budget: "800000",
      memo: "봄 제주도 여행. 벚꽃과 바다를 즐기고 싶어요.",
      expenses: [
        {
          id: "8",
          category: "숙박",
          amount: 300000,
          description: "제주 리조트 3박",
          location: "서귀포",
          date: "2024-03-05"
        },
        {
          id: "9",
          category: "교통",
          amount: 100000,
          description: "렌터카 3일",
          location: "제주",
          date: "2024-03-05"
        },
        {
          id: "10",
          category: "식사",
          amount: 150000,
          description: "흑돼지 구이",
          location: "제주시",
          date: "2024-03-06"
        }
      ],
      totalSpent: 550000,
      isCompleted: true
    }
  ]);

  // 여행 추가 (테스트용 간단 버전)
  const addTrip = (tripData) => {
    const newTrip = {
      id: Date.now().toString(),
      destination: tripData.destination,
      countryCode: tripData.countryCode,
      travelPeriod: `${tripData.startDate} ~ ${tripData.endDate}`,
      budget: tripData.budget,
      memo: tripData.memo || '',
      expenses: [],
      totalSpent: 0,
      isCompleted: false
    };
    setTrips((prevTrips) => [...prevTrips, newTrip]);
    return newTrip;
  };

  // 여행 삭제
  const deleteTrip = (tripId) => {
    setTrips((prevTrips) => prevTrips.filter(trip => trip.id !== tripId));
  };

  // 여행 수정
  const updateTrip = (tripId, updatedTripData) => {
    setTrips((prevTrips) => 
      prevTrips.map(trip => trip.id === tripId ? updatedTripData : trip)
    );
  };

  return (
    <TripsContext.Provider value={{ 
      trips, 
      addTrip,
      deleteTrip,
      updateTrip
    }}>
      {children}
    </TripsContext.Provider>
  );
};
