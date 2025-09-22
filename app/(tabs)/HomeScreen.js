import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TripsContext } from "./TripsContext";
import CountryFlag from "react-native-country-flag";

export default function HomeScreen({ navigation }) {
  const { trips, deleteTrip } = useContext(TripsContext);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  const handleDeleteTrip = (trip) => {
    setTripToDelete(trip);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (tripToDelete && deleteTrip) {
      deleteTrip(tripToDelete.id);
      setDeleteModalVisible(false);
      setTripToDelete(null);
    }
  };

  const getBudgetProgress = (budget, spent) => {
    const percentage = (spent / budget) * 100;
    return Math.min(percentage, 100);
  };

  const getBudgetColor = (percentage) => {
    if (percentage >= 100) return '#ff4444';
    if (percentage >= 80) return '#ff8800';
    if (percentage >= 60) return '#ffbb00';
    return '#4CAF50';
  };

  const renderTrip = ({ item, index }) => {
    const budgetProgress = getBudgetProgress(parseInt(item.budget), item.totalSpent || 0);
    const progressColor = getBudgetColor(budgetProgress);
    
    return (
      <View style={styles.tripItem}>
        <TouchableOpacity
          style={styles.tripContent}
          onPress={() => navigation.navigate("Spending", { tripIndex: index })}
        >
          <View style={styles.tripRow}>
            <CountryFlag isoCode={item.countryCode || "kr"} style={styles.flag} />
            <View style={styles.tripInfo}>
              <Text style={styles.tripTitle}>{item.destination}</Text>
              <Text style={styles.tripDates}>{item.travelPeriod}</Text>
              <View style={styles.budgetContainer}>
                <Text style={styles.budgetText}>
                  예산: {parseInt(item.budget).toLocaleString()}원
                </Text>
                <Text style={[styles.spentText, { color: progressColor }]}>
                  사용: {(item.totalSpent || 0).toLocaleString()}원
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${budgetProgress}%`, 
                      backgroundColor: progressColor 
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTrip(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.TopContainer}>
        <Image
          source={require("../../assets/images/tripmate-logo.png")}
          style={styles.logo}
        />
        <Ionicons
          name="add-outline"
          size={40}
          color="black"
          style={styles.icon}
          onPress={() => navigation.navigate("Planning")}
        />
      </View>
      {trips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="airplane-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>아직 여행 계획이 없습니다</Text>
          <Text style={styles.emptySubText}>+ 버튼을 눌러 첫 여행을 계획해보세요!</Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          renderItem={renderTrip}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tripList}
        />
      )}

      {/* 삭제 확인 모달 */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>여행 삭제</Text>
            <Text style={styles.modalText}>
              "{tripToDelete?.destination}" 여행을 삭제하시겠습니까?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  TopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  icon: {
    padding: 5,
  },
  tripList: {
    padding: 15,
  },
  tripItem: {
    backgroundColor: "white",
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  tripContent: {
    flex: 1,
    padding: 15,
  },
  tripRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripInfo: {
    flex: 1,
    marginLeft: 15,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  tripDates: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  budgetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  budgetText: {
    fontSize: 14,
    color: "#666",
  },
  spentText: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  flag: {
    width: 60,
    height: 45,
    resizeMode: "contain",
  },
  deleteButton: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
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
    margin: 20,
    minWidth: 280,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  deleteButton: {
    backgroundColor: "#ff4444",
  },
  cancelButtonText: {
    color: "#666",
    textAlign: "center",
    fontWeight: "600",
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
