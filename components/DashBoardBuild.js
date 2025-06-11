import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  Switch,
  Dimensions,
  Alert,
  ScrollView
} from 'react-native';
import Joystick from './JoyStick';
import Draggable from './Draggable';
import ps5Inputs from './constants/ps5mapping'
import RawJoy from './RawJoy';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Simple icon components using Text
const PlusIcon = ({ size = 24, color = 'white' }) => (
  <Text style={{ fontSize: size, color, fontWeight: 'bold' }}>+</Text>
);

const JoyIcon = ({ size = 24, color = '#007AFF' }) => (
  <Text style={{ fontSize: size, color }}>🕹️</Text>
);

const SquareIcon = ({ size = 24, color = '#007AFF' }) => (
  <Text style={{ fontSize: size, color }}>⬜</Text>
);

const TrashIcon = ({ size = 24, color = 'white' }) => (
  <Text style={{ fontSize: size, color }}>🗑️</Text>
);

const DashboardBuilder = () => {
  const [components, setComponents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const idCounter = useRef(1);
  const [selectedType, setSelectedType] = useState(null);
  const [selectingPS5Input, setSelectingPS5Input] = useState(false);
  const joyRef = useRef();

  const addComponent = (type, label) => {
    const newComponent = {
      id: idCounter.current++,
      type,
      label: label,
      x: Math.random() * (screenWidth- 100), // Account for component size
      y: Math.random() * (screenHeight - 350), // Account for header and component size
      
    };
    console.log("spawned new component", newComponent);
    setComponents((prev) => [...prev, newComponent]);
    setModalVisible(false);
  };

  const updateComponentPosition = (id, position) => {
    console.log(id);
    console.log(position);
    console.log(screenWidth);
    console.log(screenHeight);
    const constrainedPosition = {
      x: Math.max(0, Math.min(position.x, screenWidth)),
      y: Math.max(0, Math.min(position.y, screenHeight)),
    };
    //const constrainedPosition = {
    //  x: position.x,
    //  y: position.y,
    //};

    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, ...constrainedPosition } : comp
      )
    );
  };

  const selectComponent = (id) => {
    if (editMode) {
      setSelectedComponent(selectedComponent === id ? null : id);
    }
  };

  const deleteComponent = () => {
    if (selectedComponent) {
      Alert.alert(
        'Delete Component',
        'Are you sure you want to delete this component?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setComponents((prev) =>
                prev.filter((comp) => comp.id !== selectedComponent)
              );
              setSelectedComponent(null);
            },
          },
        ]
      );
    }
  };

  function getSlotByLabel(inputs, label) {
    for (const category of Object.values(inputs)) {
      const match = category.find(item => item.label === label);
      if (match && 'slot' in match) {
        return match.slot;
      }
    }
    return null; // not found or no slot
  };

  const renderComponent = (item) => {
    const onDrag = (position) => {
      updateComponentPosition(item.id, position);
    };

    const onPress = () => {
      if (editMode) {
        selectComponent(item.id);
      }
    };

    const isSelected = selectedComponent === item.id;

    const componentStyle = [
      styles.componentContainer,
      isSelected && editMode && styles.selectedComponent,
    ];

    const stickStyle = [
      styles.componentContainerCircle,
      isSelected && editMode && styles.selectedComponent,
    ]

    switch (item.type) {
      case 'joystick':
        return (
          <Draggable
            key={item.id}
            dragDisabled={!editMode}
            position={{ x: item.x, y: item.y }}
            onDrag={onDrag}
            onPress={onPress}
            style={stickStyle}
            bounds={{
              minX: 0,
              minY: 0,
              maxX: screenWidth,
              maxY: screenHeight,
            }}
          >
            <View pointerEvents={editMode ? 'none' : 'auto'}>
              <Joystick
                size={120}
                dragEnabled={!editMode}
                disabled={!editMode}
                onMove={(data) => {
                  slots = getSlotByLabel(ps5Inputs, item.label); 
                  slot = {
                    x: slots[0],
                    y: slots[1]
                  }
                  if (editMode) joyRef.current?.handleJoy('joystick', slot, data);
                }}
                onStart={() => {
                  //slots = getSlotByLabel(ps5Inputs, item.label); 
                  //slot = {
                  //  x: slots[0],
                  //  y: slots[1]
                  //}
                  //if (editMode) joyRef.current?.handleJoy('joystick', slot, {x: 0, y: 0});
                }}
                onEnd={() => {
                  console.log("end");
                  slots = getSlotByLabel(ps5Inputs, item.label); 
                  slot = {
                    x: slots[0],
                    y: slots[1]
                  }
                  if (editMode) joyRef.current?.handleJoy('joystick', slot, {x: 0, y: 0});
                }}
              />
            </View>
             <Text>{item.label}</Text>
          </Draggable>
        );
      case 'button':
        return (
          <Draggable
            key={item.id}
            dragDisabled={!editMode}
            position={{ x: item.x, y: item.y }}
            onDrag={onDrag}
            onPress={onPress}
            style={componentStyle}
            bounds={{
              minX: 0,
              minY: 0,
              maxX: screenWidth,
              maxY: screenHeight,
            }}
          >
            <View pointerEvents={editMode ? 'none' : 'auto'}>
              <TouchableOpacity
                style={[
                  styles.dynamicButton,
                  isSelected && editMode && styles.selectedButton,
                ]}
                onPress={(event) => {
                  slot = getSlotByLabel(ps5Inputs, item.label); 
                  joyRef.current?.handleJoy('button', slot, 1);
                  }}
                disabled={editMode} // Disable button when in edit mode
                activeOpacity={editMode ? 1 : 0.8}
                >
                <Text style={styles.buttonText}>{item.label}</Text>
              </TouchableOpacity>
            </View>
          </Draggable>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <RawJoy ref={joyRef} />
      <View style={styles.header}>
        <View style={styles.editToggle}>
          <Text style={styles.modeText}>
            {editMode ? 'Edit Mode: ON' : 'Edit Mode: OFF'}
          </Text>
          <Switch 
            value={editMode} 
            onValueChange={(value) => {
              setEditMode(value);
              if (!value) setSelectedComponent(null);
            }} 
          />
        </View>
        
        {/* Component counter and instructions */}
        <View style={styles.infoContainer}>
          <Text style={styles.counterText}>
            Components: {components.length}
          </Text>
          {editMode && (
            <Text style={styles.instructionText}>
              Tap to select • Drag to move
            </Text>
          )}
        </View>
      </View>

      <View style={styles.dynamicArea}>
        {components.map(renderComponent)}
        
        {/* Selection indicator */}
        {selectedComponent && editMode && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              Selected: Component {selectedComponent}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        {selectedComponent && editMode && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={deleteComponent}
          >
            <TrashIcon size={24} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.addButton,
            !editMode && { display: 'none' },
          ]}
          onPress={() => setModalVisible(true)}
          >
          <PlusIcon size={30} color="white" />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={modalVisible} animationType="slide">
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modal}>
            {selectingPS5Input ? (<>
                <Text style={styles.modalTitle}>
                  Select {selectedType === 'joystick' ? 'Joystick' : 'Button'} to Mimic
                </Text>

                <View style={styles.tileGrid}>
                  {ps5Inputs[selectedType].map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.tileButton}
                      onPress={() => {
                        addComponent(selectedType, item.label, item.id);
                        setSelectingPS5Input(false);
                        setSelectedType(null);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.tileTitle}>{item.label}</Text>
                      <Text style={styles.tileSubtitle}>{item.id}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setSelectingPS5Input(false);
                    setSelectedType(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Back</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Add Component</Text>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setSelectedType('joystick');
                    setSelectingPS5Input(true);
                  }}
                >
                  <View style={styles.iconContainer}>
                    <JoyIcon size={24} color="#007AFF" />
                  </View>
                  <View>
                    <Text style={styles.menuItemTitle}>Joystick</Text>
                    <Text style={styles.menuItemSubtitle}>Interactive control stick</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setSelectedType('button');
                    setSelectingPS5Input(true);
                  }}
                >
                  <View style={styles.iconContainer}>
                    <SquareIcon size={24} color="#007AFF" />
                  </View>
                  <View>
                    <Text style={styles.menuItemTitle}>Button</Text>
                    <Text style={styles.menuItemSubtitle}>Tap to trigger action</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  editToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoContainer: {
    alignItems: 'center',
  },
  counterText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 12,
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  dynamicArea: { 
    flex: 1,
    position: 'relative',
  },
  componentContainer: {
    //backgroundColor: 'rgba(255, 0, 0, 0.1)', // debugging background
    borderWidth: 1,
    borderColor: 'transparent',
    width: 84,
    height: 84,
  },
  componentContainerCircle: {
    //backgroundColor: 'rgba(255, 0, 0, 0.1)', // debugging background
    borderWidth: 1,
    borderColor: 'transparent',
    width: 120,
    height: 120,
    borderRadius: 60, // half of width/height
    justifyContent: 'center',
    alignItems: 'center', // optional, for centering children
  },

  selectedComponent: {
    // Visual feedback for selected components
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  dynamicButton: {
    backgroundColor: '#007AFF',
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedButton: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editModeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  selectionInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },

  duplicateText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    marginRight: 12,
    width: 32,
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  ps5Modal: {
  padding: 20,
  backgroundColor: '#fff',
  borderRadius: 12,
  margin: 20,
  elevation: 5,
},

tileGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: 15,
},

tileButton: {
  width: '48%',
  backgroundColor: '#f0f4ff',
  borderRadius: 10,
  padding: 15,
  marginBottom: 15,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
},

tileTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#007AFF',
},

tileSubtitle: {
  fontSize: 12,
  color: '#555',
  marginTop: 4,
},

});

export default DashboardBuilder;