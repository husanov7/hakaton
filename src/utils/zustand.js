
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export const useOrderStore = create(
//   persist(
//     (set, get) => ({
//       order: [], // ← Default qiymat
      
//       // ✅ Yangi ovqat qo'shish yoki mavjud ovqat sonini oshirish
//       addItem: (dish) => set((state) => {
//         console.log('🔄 addItem called:', dish);
        
//         // ✅ Variantli ovqat uchun unique ID (dishId + variantId)
//         const itemId = dish.variantId 
//           ? `${dish.dishId}_${dish.variantId}` 
//           : dish.id;
        
//         const existing = state.order.find((item) => item.id === itemId);
        
//         if (existing) {
//           // Agar mavjud bo'lsa, sonini oshirish
//           console.log('✅ Item mavjud, sonini oshiramiz');
//           return {
//             order: state.order.map((item) =>
//               item.id === itemId
//                 ? { ...item, count: item.count + (dish.count || 1) }
//                 : item
//             ),
//           };
//         }
        
//         // ✅ Yangi ovqat qo'shish
//         console.log('✅ Yangi item qo\'shamiz');
//         const newItem = {
//           ...dish,
//           id: itemId, // Unique ID
//           count: dish.count || 1,
//         };
        
//         return {
//           order: [...state.order, newItem],
//         };
//       }),
      
//       // ✅ Ovqatni butunlay o'chirish (korzinkadan olib tashlash)
//       removeItem: (id) => set((state) => {
//         console.log('🗑️ removeItem called:', id);
//         return {
//           order: state.order.filter((item) => item.id !== id),
//         };
//       }),
      
//       // ✅ Ovqat sonini 1 ga oshirish
//       incrementItem: (id) => set((state) => {
//         console.log('➕ incrementItem called:', id);
//         return {
//           order: state.order.map((item) =>
//             item.id === id ? { ...item, count: item.count + 1 } : item
//           ),
//         };
//       }),
      
//       // ✅ Ovqat sonini 1 ga kamaytirish (agar 1 bo'lsa, korzinkadan o'chirish)
//       decrementItem: (id) => set((state) => {
//         console.log('➖ decrementItem called:', id);
//         const existing = state.order.find((item) => item.id === id);
        
//         if (existing && existing.count > 1) {
//           // Agar 1 dan ko'p bo'lsa, sonini kamaytirish
//           return {
//             order: state.order.map((item) =>
//               item.id === id
//                 ? { ...item, count: item.count - 1 }
//                 : item
//             ),
//           };
//         } else {
//           // Agar 1 bo'lsa, korzinkadan butunlay o'chirish
//           return {
//             order: state.order.filter((item) => item.id !== id),
//           };
//         }
//       }),
      
//       // ✅ Korzinkani tozalash
//       clearOrder: () => {
//         console.log('🧹 clearOrder called');
//         set({ order: [] });
//       },
      
//       // ✅ Helper funksiyalar
//       getTotalPrice: () => {
//         const { order } = get();
//         return order.reduce((sum, item) => {
//           const price = Number(item.price) || 0;
//           const count = Number(item.count) || 0;
//            const addons = Number(item.addonsTotal) || 0;
//           return sum + (price * count);
//         }, 0);
//       },
      
//       getTotalItems: () => {
//         const { order } = get();
//         return order.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
//       },
      
//       // ✅ Yangi: Ma'lum bir dish uchun barcha variantlar sonini olish
//       getDishTotalCount: (dishId) => {
//         const { order } = get();
//         const dishItems = order.filter(item => 
//           item.dishId === dishId || item.id === dishId
//         );
//         return dishItems.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
//       },
      
//       // ✅ Yangi: Ma'lum bir variant borligini tekshirish
//       hasVariant: (dishId, variantId) => {
//         const { order } = get();
//         const itemId = `${dishId}_${variantId}`;
//         return order.some(item => item.id === itemId);
//       },
      
//       // ✅ Yangi: Ma'lum bir variant sonini olish
//       getVariantCount: (dishId, variantId) => {
//         const { order } = get();
//         const itemId = `${dishId}_${variantId}`;
//         const item = order.find(i => i.id === itemId);
//         return item ? item.count : 0;
//       },
//     }),
//     {
//       name: 'order-storage', // localStorage key
//       // ✅ Version qo'shamiz (eski ma'lumotlarni tozalash uchun)
//       version: 2,
//       migrate: (persistedState, version) => {
//         if (version < 2) {
//           // Eski versiyadan yangi versiyaga o'tish
//           console.log('🔄 Migrating from old version, clearing order...');
//           return { order: [] };
//         }
//         return persistedState;
//       },
//     }
//   )
// );

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      order: [],
      
      addItem: (dish) => set((state) => {
        console.log('🔄 addItem called:', dish);
        
        const itemId = dish.variantId 
          ? `${dish.dishId}_${dish.variantId}` 
          : dish.id;
        
        const existing = state.order.find((item) => item.id === itemId);
        
        if (existing) {
          console.log('✅ Item mavjud, sonini oshiramiz');
          return {
            order: state.order.map((item) =>
              item.id === itemId
                ? { ...item, count: item.count + (dish.count || 1) }
                : item
            ),
          };
        }
        
        console.log('✅ Yangi item qo\'shamiz');
        const newItem = {
          ...dish,
          id: itemId,
          count: dish.count || 1,
        };
        
        return {
          order: [...state.order, newItem],
        };
      }),
      
      removeItem: (id) => set((state) => {
        console.log('🗑️ removeItem called:', id);
        return {
          order: state.order.filter((item) => item.id !== id),
        };
      }),
      
      incrementItem: (id) => set((state) => {
        console.log('➕ incrementItem called:', id);
        return {
          order: state.order.map((item) =>
            item.id === id ? { ...item, count: item.count + 1 } : item
          ),
        };
      }),
      
      decrementItem: (id) => set((state) => {
        console.log('➖ decrementItem called:', id);
        const existing = state.order.find((item) => item.id === id);
        
        if (existing && existing.count > 1) {
          return {
            order: state.order.map((item) =>
              item.id === id
                ? { ...item, count: item.count - 1 }
                : item
            ),
          };
        } else {
          return {
            order: state.order.filter((item) => item.id !== id),
          };
        }
      }),
      
      clearOrder: () => {
        console.log('🧹 clearOrder called');
        set({ order: [] });
      },
      
      // ✅ TO'G'RILANGAN: Qo'shimchalar narxini hisobga olish
      getTotalPrice: () => {
        const { order } = get();
        return order.reduce((sum, item) => {
          const basePrice = Number(item.price) || 0;
          const addonsPrice = Number(item.addonsTotal) || 0;
          const count = Number(item.count) || 0;
          
          // ✅ Formula: (asosiy narx × miqdor) + (qo'shimchalar × miqdor)
          const itemTotal = (basePrice + addonsPrice) * count;
          
          return sum + itemTotal;
        }, 0);
      },
      
      getTotalItems: () => {
        const { order } = get();
        return order.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
      },
      
      getDishTotalCount: (dishId) => {
        const { order } = get();
        const dishItems = order.filter(item => 
          item.dishId === dishId || item.id === dishId
        );
        return dishItems.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
      },
      
      hasVariant: (dishId, variantId) => {
        const { order } = get();
        const itemId = `${dishId}_${variantId}`;
        return order.some(item => item.id === itemId);
      },
      
      getVariantCount: (dishId, variantId) => {
        const { order } = get();
        const itemId = `${dishId}_${variantId}`;
        const item = order.find(i => i.id === itemId);
        return item ? item.count : 0;
      },
    }),
    {
      name: 'order-storage',
      version: 3, // ✅ Version oshirdik (yangi hisoblash formulasi uchun)
      migrate: (persistedState, version) => {
        if (version < 3) {
          console.log('🔄 Migrating to v3, clearing order...');
          return { order: [] };
        }
        return persistedState;
      },
    }
  )
);