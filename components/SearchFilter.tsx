import { theme } from '@/constants/theme';
import { Search, X } from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (text: string) => void;
  onClearSearch: () => void;
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  filters: { id: string; label: string }[];
  placeholder?: string;
}

export default function SearchFilter({
  searchValue,
  onSearchChange,
  onClearSearch,
  activeFilter,
  onFilterChange,
  filters,
  placeholder = 'Buscar...',
}: SearchFilterProps) {
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={18} color={theme.colors.mediumGray} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.mediumGray}
          value={searchValue}
          onChangeText={onSearchChange}
        />
        {searchValue && (
          <TouchableOpacity onPress={onClearSearch}>
            <X size={18} color={theme.colors.mediumGray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      {filters.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilter === null && styles.filterChipActive,
            ]}
            onPress={() => onFilterChange(null)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === null && styles.filterTextActive,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>

          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() =>
                onFilterChange(activeFilter === filter.id ? null : filter.id)
              }
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.mediumGray,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.black,
  },
  filtersScroll: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },
  filtersContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.lightGray,
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.darkGray,
  },
  filterTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
  },
});
