import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface LogoutConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function LogoutConfirmModal({ 
  visible, 
  onClose, 
  onConfirm, 
  isLoading 
}: LogoutConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Feather name="log-out" size={40} color="#EF4444" />
          </View>
          
          <Text style={styles.title}>Log Out</Text>
          
          <Text style={styles.message}>
            Are you sure you want to log out?
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoutButton}
            >
              <TouchableOpacity
                onPress={onConfirm}
                disabled={isLoading}
                style={styles.logoutButtonInner}
              >
                <Text style={styles.logoutButtonText}>
                  {isLoading ? 'Logging out...' : 'Log Out'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutButtonInner: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});