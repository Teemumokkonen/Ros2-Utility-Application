if(NOT TARGET react-native-reanimated::reanimated)
add_library(react-native-reanimated::reanimated SHARED IMPORTED)
set_target_properties(react-native-reanimated::reanimated PROPERTIES
    IMPORTED_LOCATION "/home/teemu/dev/RosApp/node_modules/react-native-reanimated/android/build/intermediates/cxx/Debug/2ib4g505/obj/x86/libreanimated.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/teemu/dev/RosApp/node_modules/react-native-reanimated/android/build/prefab-headers/reanimated"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

if(NOT TARGET react-native-reanimated::worklets)
add_library(react-native-reanimated::worklets SHARED IMPORTED)
set_target_properties(react-native-reanimated::worklets PROPERTIES
    IMPORTED_LOCATION "/home/teemu/dev/RosApp/node_modules/react-native-reanimated/android/build/intermediates/cxx/Debug/2ib4g505/obj/x86/libworklets.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/teemu/dev/RosApp/node_modules/react-native-reanimated/android/build/prefab-headers/worklets"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

