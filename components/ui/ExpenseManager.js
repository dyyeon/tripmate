import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TripsContext } from "../../app/(tabs)/TripsContext";

const categories = [
  { id: "숙박", icon: "bed-outline", color: "#4CAF50" },
  { id: "교통", icon: "car-outline", color: "#2196F3" },
  { id: "식사", icon: "restaurant-outline", color: "#FF9800" },
  { id: "관광", icon: "camera-outline", color: "#9C27B0" },
  { id: "쇼핑", icon: "bag-outline", color: "#E91E63" },
  { id: "기타", icon: "ellipsis-horizontal-outline", color: "#607D8B" },
];

export default function ExpenseManager({ trip, tripIndex }) {
  const { trips, updateTrip } = useContext(TripsContext);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    category: "식사",
    amount: "",
    description: "",
    location: "",
  });

  const currentTrip = trips[tripIndex];

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) {
      Alert.alert("오류", "금액과 설명을 입력해주세요.");
      return;
    }

    const expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      location: newExpense.location,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedTrip = {
      ...currentTrip,
      expenses: [...(currentTrip.expenses || []), expense],
      totalSpent: (currentTrip.totalSpent || 0) + expense.amount,
    };

    updateTrip(currentTrip.id, updatedTrip);
    setNewExpense({ category: "식사", amount: "", description: "", location: "" });
    setIsAddModalVisible(false);
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);
    setNewExpense({
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description,
      location: expense.location || "",
    });
    setIsEditModalVisible(true);
  };

  const updateExpense = () => {
    if (!newExpense.amount || !newExpense.description) {
      Alert.alert("오류", "금액과 설명을 입력해주세요.");
      return;
    }

    const updatedExpenses = currentTrip.expenses.map(exp => 
      exp.id === editingExpense.id 
        ? {
            ...exp,
            category: newExpense.category,
            amount: parseFloat(newExpense.amount),
            description: newExpense.description,
            location: newExpense.location,
          }
        : exp
    );

    const newTotalSpent = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const updatedTrip = {
      ...currentTrip,
      expenses: updatedExpenses,
      totalSpent: newTotalSpent,
    };

    updateTrip(currentTrip.id, updatedTrip);
    setNewExpense({ category: "식사", amount: "", description: "", location: "" });
    setIsEditModalVisible(false);
    setEditingExpense(null);
  };

  const deleteExpense = (expenseId) => {
    Alert.alert(
      "지출 삭제",
      "이 지출을 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            const updatedExpenses = currentTrip.expenses.filter(exp => exp.id !== expenseId);
            const newTotalSpent = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

            const updatedTrip = {
              ...currentTrip,
              expenses: updatedExpenses,
              totalSpent: newTotalSpent,
            };

            updateTrip(currentTrip.id, updatedTrip);
          },
        },
      ]
    );
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : "ellipsis-horizontal-outline";
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : "#607D8B";
  };

  const renderExpense = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseLeft}>
        <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(item.category) }]}>
          <Ionicons name={getCategoryIcon(item.category)} size={20} color="white" />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          <Text style={styles.expenseCategory}>{item.category}</Text>
          {item.location && <Text style={styles.expenseLocation}>{item.location}</Text>}
        </View>
      </View>
      <View style={styles.expenseRight}>
        <Text style={styles.expenseAmount}>{item.amount.toLocaleString()}원</Text>
        <View style={styles.expenseActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => editExpense(item)}
          >
            <Ionicons name="pencil-outline" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteExpense(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderAddModal = () => (
    <Modal
      visible={isAddModalVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>지출 추가</Text>
          
          <Text style={styles.label}>카테고리</Text>
          <View style={styles.categoryGrid}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  newExpense.category === category.id && styles.selectedCategory
                ]}
                onPress={() => setNewExpense({...newExpense, category: category.id})}
              >
                <Ionicons 
                  name={category.icon} 
                  size={20} 
                  color={newExpense.category === category.id ? "white" : category.color} 
                />
                <Text style={[
                  styles.categoryText,
                  newExpense.category === category.id && styles.selectedCategoryText
                ]}>
                  {category.id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>금액</Text>
          <TextInput
            style={styles.input}
            placeholder="금액을 입력하세요"
            value={newExpense.amount}
            onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
            keyboardType="numeric"
          />

          <Text style={styles.label}>설명</Text>
          <TextInput
            style={styles.input}
            placeholder="지출 내용을 입력하세요"
            value={newExpense.description}
            onChangeText={(text) => setNewExpense({...newExpense, description: text})}
          />

          <Text style={styles.label}>장소 (선택사항)</Text>
          <TextInput
            style={styles.input}
            placeholder="장소를 입력하세요"
            value={newExpense.location}
            onChangeText={(text) => setNewExpense({...newExpense, location: text})}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsAddModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={addExpense}
            >
              <Text style={styles.saveButtonText}>추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEditModal = () => (
    <Modal
      visible={isEditModalVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>지출 수정</Text>
          
          <Text style={styles.label}>카테고리</Text>
          <View style={styles.categoryGrid}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  newExpense.category === category.id && styles.selectedCategory
                ]}
                onPress={() => setNewExpense({...newExpense, category: category.id})}
              >
                <Ionicons 
                  name={category.icon} 
                  size={20} 
                  color={newExpense.category === category.id ? "white" : category.color} 
                />
                <Text style={[
                  styles.categoryText,
                  newExpense.category === category.id && styles.selectedCategoryText
                ]}>
                  {category.id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>금액</Text>
          <TextInput
            style={styles.input}
            placeholder="금액을 입력하세요"
            value={newExpense.amount}
            onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
            keyboardType="numeric"
          />

          <Text style={styles.label}>설명</Text>
          <TextInput
            style={styles.input}
            placeholder="지출 내용을 입력하세요"
            value={newExpense.description}
            onChangeText={(text) => setNewExpense({...newExpense, description: text})}
          />

          <Text style={styles.label}>장소 (선택사항)</Text>
          <TextInput
            style={styles.input}
            placeholder="장소를 입력하세요"
            value={newExpense.location}
            onChangeText={(text) => setNewExpense({...newExpense, location: text})}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={updateExpense}
            >
              <Text style={styles.saveButtonText}>수정</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const remainingBudget = parseInt(currentTrip.budget) - (currentTrip.totalSpent || 0);
  const budgetPercentage = (currentTrip.totalSpent || 0) / parseInt(currentTrip.budget) * 100;

  return (
    <View style={styles.container}>
      {/* 예산 정보 */}
      <View style={styles.budgetCard}>
        <Text style={styles.budgetTitle}>예산 현황</Text>
        <View style={styles.budgetRow}>
          <Text style={styles.budgetLabel}>총 예산:</Text>
          <Text style={styles.budgetValue}>{parseInt(currentTrip.budget).toLocaleString()}원</Text>
        </View>
        <View style={styles.budgetRow}>
          <Text style={styles.budgetLabel}>사용 금액:</Text>
          <Text style={[styles.budgetValue, { color: budgetPercentage > 80 ? '#ff4444' : '#333' }]}>
            {(currentTrip.totalSpent || 0).toLocaleString()}원
          </Text>
        </View>
        <View style={styles.budgetRow}>
          <Text style={styles.budgetLabel}>남은 예산:</Text>
          <Text style={[styles.budgetValue, { color: remainingBudget < 0 ? '#ff4444' : '#4CAF50' }]}>
            {remainingBudget.toLocaleString()}원
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(budgetPercentage, 100)}%`,
                backgroundColor: budgetPercentage > 100 ? '#ff4444' : 
                               budgetPercentage > 80 ? '#ff8800' : '#4CAF50'
              }
            ]} 
          />
        </View>
      </View>

      {/* 지출 목록 */}
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseTitle}>지출 내역</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>

      {currentTrip.expenses && currentTrip.expenses.length > 0 ? (
        <FlatList
          data={currentTrip.expenses}
          renderItem={renderExpense}
          keyExtractor={(item) => item.id}
          style={styles.expenseList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>아직 지출 내역이 없습니다</Text>
          <Text style={styles.emptySubText}>+ 버튼을 눌러 지출을 추가해보세요</Text>
        </View>
      )}

      {renderAddModal()}
      {renderEditModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  budgetCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: "#666",
  },
  budgetValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "600",
  },
  expenseList: {
    flex: 1,
  },
  expenseItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  expenseCategory: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  expenseLocation: {
    fontSize: 12,
    color: "#999",
  },
  expenseRight: {
    alignItems: "flex-end",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  expenseActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 10,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#666",
  },
  selectedCategoryText: {
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButtonText: {
    color: "#666",
    textAlign: "center",
    fontWeight: "600",
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
