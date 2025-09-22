import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TripsContext } from "./TripsContext";
import ExpenseManager from "../../components/ui/ExpenseManager";

export default function SpendingScreen({ route, navigation }) {
  const { tripIndex } = route.params; // 여행 index를 가져옴
  const { trips } = useContext(TripsContext);
  const trip = trips[tripIndex]; // 현재 여행 정보

  if (!trip) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.arrowIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>여행 정보를 찾을 수 없습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrowIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.tripTitle}>{trip.destination}</Text>
          <Text style={styles.tripDates}>{trip.travelPeriod}</Text>
        </View>
      </View>
      <ExpenseManager trip={trip} tripIndex={tripIndex} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  arrowIcon: {
    padding: 5,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  tripDates: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
});
