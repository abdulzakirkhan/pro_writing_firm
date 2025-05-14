import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Modal,
  Text,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import Pdf from "react-native-pdf";

const PreviewOrderFile = ({ route }) => {
  const { fileUrl, paymentPercentage = 0.5 } = route?.params || {};
  const fileType = fileUrl?.split('.').pop()?.toLowerCase();
  const navigation = useNavigation();

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [restricted, setRestricted] = useState(false);

  const [numPages, setNumPages] = useState(0);
  const [allowedPages, setAllowedPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollViewRef = useRef(null);

  // DOCX: Scroll restriction logic
  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const scrollPosition = contentOffset.y + layoutMeasurement.height;
    const totalHeight = contentSize.height;

    if (scrollPosition >= totalHeight * paymentPercentage && scrollEnabled) {
      setScrollEnabled(false);
      setRestricted(true);
      setModalVisible(true);
      scrollViewRef.current?.scrollTo({
        y: totalHeight * paymentPercentage,
        animated: false
      });
    }
  };

  // PDF: Page-based restriction
  const handlePdfLoadComplete = (pages) => {
    const allowed = Math.max(1, Math.ceil(pages * paymentPercentage));
    console.log("Allowed pages",allowed)
    setNumPages(pages);
    setAllowedPages(allowed);
  };

  const handlePdfPageChanged = (page) => {
    setCurrentPage(page);
    if (page >= allowedPages && !restricted) {
      setRestricted(true);
      setModalVisible(true);
    }
  };

  const handleAccessDenied = () => {
    setModalVisible(false);
    setRestricted(false);
    navigation.navigate("AgentOrders");
  };

  return (
    <View style={{ flex: 1 }}>

      {/* ✅ DOCX Preview with scroll control */}
      {fileType === "docx" && !restricted && (
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          scrollEnabled={scrollEnabled}
        >
          <View style={{ height: Dimensions.get("window").height * 3 }}>
            <WebView
              source={{
                uri: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`
              }}
              style={{
                height: Dimensions.get("window").height * 1.5,
                width: Dimensions.get("window").width
              }}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      )}

      {/* ✅ PDF Preview with page restriction */}
      {fileType === "pdf" && (
        <View style={{ flex: 1 }}>
          <Pdf
            source={{ uri: `https://icseindia.org/document/sample.pdf`, cache: true }}
            trustAllCerts={false}
            onLoadComplete={handlePdfLoadComplete}
            onPageChanged={handlePdfPageChanged}
            onError={(error) => console.log("PDF Error:", error)}
            style={{ flex: 1, width: Dimensions.get("window").width }}
          />

          {/* Overlay to block PDF when restricted */}
          {restricted && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999
              }}
            >
              <Text style={{ color: "white", fontSize: 16, marginBottom: 20, textAlign: "center" }}>
                You can only preview the first {allowedPages} pages. Unlock the full file by paying.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#13A09D",
                  padding: 12,
                  borderRadius: 5
                }}
                onPress={handleAccessDenied}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Go to Payment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* ✅ Common Modal for both PDF & DOCX */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.9)", // Matching black overlay
          zIndex: 999,
          elevation: 10
        }}>
          <View style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
            width: "80%",
          }}>
            <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 20 }}>
              You’ve reached the preview limit. Please make payment to continue.
            </Text>
            <TouchableOpacity
              onPress={handleAccessDenied}
              style={{ backgroundColor: "#13A09D", padding: 10, borderRadius: 5 }}
            >
              <Text style={{ color: "white" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PreviewOrderFile;




{fileType === "docx" && (
              <div ref={scrollViewRef} onScroll={handleScroll}
                className="h-[80vh]"
                
              >
                <Iframe
                  url={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    fileUrl
                  )}`}
                  width="100%"
                //   height={`${iframeHeight}px`}
                className="h-[80vh]"
                  display="block"
                  position="relative"
                />
                {/* <div className="p-4 text-sm text-gray-600">
                  Scroll limit: {paymentPercentage}% of document available
                </div> */}
              </div>
            )}