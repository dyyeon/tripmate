import apiService from './api';

class TripService {
  async getTrips() {
    try {
      return await apiService.getTrips();
    } catch (error) {
      console.error('여행 목록 조회 에러:', error);
      throw error;
    }
  }

  async getTrip(id) {
    try {
      return await apiService.getTrip(id);
    } catch (error) {
      console.error('여행 조회 에러:', error);
      throw error;
    }
  }

  async createTrip(tripData) {
    try {
      // 프론트엔드 데이터를 백엔드 형식으로 변환
      const formattedData = {
        destination: tripData.destination,
        countryCode: tripData.countryCode,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        budget: parseInt(tripData.budget),
        memo: tripData.memo || ''
      };

      return await apiService.createTrip(formattedData);
    } catch (error) {
      console.error('여행 생성 에러:', error);
      throw error;
    }
  }

  async updateTrip(id, tripData) {
    try {
      const formattedData = {
        ...tripData,
        budget: tripData.budget ? parseInt(tripData.budget) : undefined
      };

      return await apiService.updateTrip(id, formattedData);
    } catch (error) {
      console.error('여행 수정 에러:', error);
      throw error;
    }
  }

  async deleteTrip(id) {
    try {
      return await apiService.deleteTrip(id);
    } catch (error) {
      console.error('여행 삭제 에러:', error);
      throw error;
    }
  }

  async addExpense(tripId, expenseData) {
    try {
      const formattedData = {
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        description: expenseData.description,
        date: expenseData.date,
        location: expenseData.location || ''
      };

      return await apiService.addExpense(tripId, formattedData);
    } catch (error) {
      console.error('지출 추가 에러:', error);
      throw error;
    }
  }

  async updateExpense(tripId, expenseId, expenseData) {
    try {
      const formattedData = {
        ...expenseData,
        amount: expenseData.amount ? parseFloat(expenseData.amount) : undefined
      };

      return await apiService.updateExpense(tripId, expenseId, formattedData);
    } catch (error) {
      console.error('지출 수정 에러:', error);
      throw error;
    }
  }

  async deleteExpense(tripId, expenseId) {
    try {
      return await apiService.deleteExpense(tripId, expenseId);
    } catch (error) {
      console.error('지출 삭제 에러:', error);
      throw error;
    }
  }

  // 여행 데이터를 프론트엔드 형식으로 변환
  formatTripForFrontend(trip) {
    return {
      id: trip._id,
      destination: trip.destination,
      countryCode: trip.countryCode,
      travelPeriod: `${trip.startDate.split('T')[0]} ~ ${trip.endDate.split('T')[0]}`,
      budget: trip.budget.toString(),
      memo: trip.memo,
      expenses: trip.expenses || [],
      totalSpent: trip.totalSpent || 0,
      isCompleted: trip.isCompleted || false
    };
  }

  // 지출 데이터를 프론트엔드 형식으로 변환
  formatExpenseForFrontend(expense) {
    return {
      id: expense._id,
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description,
      date: expense.date,
      location: expense.location
    };
  }
}

export default new TripService();
