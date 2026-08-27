// MockBackend: Data integration layer for leaderboards, achievements, and daily challenge

export const MockBackend = {
  getLeaderboard(tab = 'global') {
    if (tab === 'friends') {
      return [
        { rank: 1, handle: '@bit_crasher', title: 'Master', xp: '132,100', levels: 395, score: '9,450', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsR47JXLXmx5ja93SRiRd72ASH-oIyc2ZwUFO-JY6ipr5XKzbiLHNEKN4m_5mg19lPN6Ur8H4p0Q9VbwHocGHIJ2o-NrCz5T_gczxp_oxGLRV4KrtWe-8fMP5OI1ISltmPWahQaBYBeKtMpuFw64ESnhp0bKSFl0V-i1R4nNDEZdE0n0N4GiSM2t6udjI1vZRDHiMi2LDJXRmIpChSihJeTuQq46Y5Q-GtipkGFxTgVk_qK72BiZ8' },
        { rank: 2, handle: '@cyber_ninja (You)', title: 'Grandmaster', xp: '145,230', levels: 420, score: '9,999', isUser: true, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpSIs8lzKW5g1qJ4SJylv7qOrt-EmLYp9tHKVhQgw1p7yLeEx6SMQxJt4TVbKGXVDCHWaNfVJ98nlYFFe0o3jJC12J9kvfbKVEcH0tbHMjDxQ2DIhgW0lGDmiqqZTBjIjS0QQykirJlszrGWr4sbtCpJvs76AkYu1MJHTC_nw9dxZ9mVgwmdoT7F-MxMDm7m_jlQCg-y0zi8EQbt3bepNms4XiV1ap18xLb-bhyjaS8KzSzAFPunY' },
        { rank: 3, handle: '@git_guru', title: 'Platinum', xp: '110,400', levels: 310, score: '8,800', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDen8Ka6duWuOF49zomdOYJ9-ic1S5o3YZpY76w7FAQp9GClFjyr0FHXVqgL4BZNZyDGalfCuM-CRTzu7ShV25X9df5ELG9Rjs3882nQIBC9SlDr7NESJYJliBNYllx0ivxXVhfO3txoyNS5yoXGREsA-S6EX_3pe1KOQ8pwiiKWrijza0hAljYNTuHZI1TrGAHxTQkCckb4nkrv5x4xhh_WtqfSKZltzFIPEKq_UQ6AITIerEjNe8' }
      ];
    }
    
    if (tab === 'weekly') {
      return [
        { rank: 1, handle: '@cyber_ninja (You)', title: 'Grandmaster', xp: '14,500', levels: 42, score: '9,999', isUser: true, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpSIs8lzKW5g1qJ4SJylv7qOrt-EmLYp9tHKVhQgw1p7yLeEx6SMQxJt4TVbKGXVDCHWaNfVJ98nlYFFe0o3jJC12J9kvfbKVEcH0tbHMjDxQ2DIhgW0lGDmiqqZTBjIjS0QQykirJlszrGWr4sbtCpJvs76AkYu1MJHTC_nw9dxZ9mVgwmdoT7F-MxMDm7m_jlQCg-y0zi8EQbt3bepNms4XiV1ap18xLb-bhyjaS8KzSzAFPunY' },
        { rank: 2, handle: '@null_pointer', title: 'Diamond', xp: '12,800', levels: 38, score: '9,120', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnjEHeR5FicaFzv0IsoTnOYhdMapFThJVEvVIbGEQBwNPBY73TlTRzl3tulPu7dLrn_LICvk_iuhD9p7_r8hcuWtgMdJSriUvTLVdXW1uMBKqU0fkiZoGDcUZIi8FP4kdQHbIc12qJ3pbPyDWYpwGTWEQwuBMFutWyk10PVUTjj_TYXutgfzEuSghcSqExqju2to-1aIjamq-y_Md-FArvNcu56Uinp1EhilkzzXVAOvJRW59qb0w' },
        { rank: 3, handle: '@code_samurai', title: 'Diamond', xp: '10,950', levels: 32, score: '8,750', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV-l6aASi099b0k8TuQjm1zBzBY5mRGzy34Y4li-HLDqTBjUTbsg5js9KKDKEcjF7cxamuG7Pw2NmCZdlOB8QnrqNd7MW5ARLKvLhKIB1UxTzcp76Z1GXBT9bXm8i6qu15u53H1MBC6hVkEtGmLbr_3fI_lSzG9RbNOPJeZkrr2NsmI-mPEEXFxHszPnLc_jO-6u_fHdTe6x_MRXfwTtLnWFx3Dxt4GhMO7KULc_d_UP-CPm-gONk' }
      ];
    }

    // Default Global
    return [
      { rank: 1, handle: '@cyber_ninja (You)', title: 'Grandmaster', xp: '145,230', levels: 420, score: '9,999', isUser: true, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpSIs8lzKW5g1qJ4SJylv7qOrt-EmLYp9tHKVhQgw1p7yLeEx6SMQxJt4TVbKGXVDCHWaNfVJ98nlYFFe0o3jJC12J9kvfbKVEcH0tbHMjDxQ2DIhgW0lGDmiqqZTBjIjS0QQykirJlszrGWr4sbtCpJvs76AkYu1MJHTC_nw9dxZ9mVgwmdoT7F-MxMDm7m_jlQCg-y0zi8EQbt3bepNms4XiV1ap18xLb-bhyjaS8KzSzAFPunY' },
      { rank: 2, handle: '@bit_crasher', title: 'Master', xp: '132,100', levels: 395, score: '9,450', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsR47JXLXmx5ja93SRiRd72ASH-oIyc2ZwUFO-JY6ipr5XKzbiLHNEKN4m_5mg19lPN6Ur8H4p0Q9VbwHocGHIJ2o-NrCz5T_gczxp_oxGLRV4KrtWe-8fMP5OI1ISltmPWahQaBYBeKtMpuFw64ESnhp0bKSFl0V-i1R4nNDEZdE0n0N4GiSM2t6udjI1vZRDHiMi2LDJXRmIpChSihJeTuQq46Y5Q-GtipkGFxTgVk_qK72BiZ8' },
      { rank: 3, handle: '@null_pointer', title: 'Diamond', xp: '128,450', levels: 380, score: '9,120', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnjEHeR5FicaFzv0IsoTnOYhdMapFThJVEvVIbGEQBwNPBY73TlTRzl3tulPu7dLrn_LICvk_iuhD9p7_r8hcuWtgMdJSriUvTLVdXW1uMBKqU0fkiZoGDcUZIi8FP4kdQHbIc12qJ3pbPyDWYpwGTWEQwuBMFutWyk10PVUTjj_TYXutgfzEuSghcSqExqju2to-1aIjamq-y_Md-FArvNcu56Uinp1EhilkzzXVAOvJRW59qb0w' },
      { rank: 4, handle: '@stack_trace', title: 'Diamond', xp: '115,200', levels: 340, score: '8,900', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDen8Ka6duWuOF49zomdOYJ9-ic1S5o3YZpY76w7FAQp9GClFjyr0FHXVqgL4BZNZyDGalfCuM-CRTzu7ShV25X9df5ELG9Rjs3882nQIBC9SlDr7NESJYJliBNYllx0ivxXVhfO3txoyNS5yoXGREsA-S6EX_3pe1KOQ8pwiiKWrijza0hAljYNTuHZI1TrGAHxTQkCckb4nkrv5x4xhh_WtqfSKZltzFIPEKq_UQ6AITIerEjNe8' },
      { rank: 5, handle: '@merge_conflict', title: 'Platinum', xp: '98,750', levels: 290, score: '8,400', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV-l6aASi099b0k8TuQjm1zBzBY5mRGzy34Y4li-HLDqTBjUTbsg5js9KKDKEcjF7cxamuG7Pw2NmCZdlOB8QnrqNd7MW5ARLKvLhKIB1UxTzcp76Z1GXBT9bXm8i6qu15u53H1MBC6hVkEtGmLbr_3fI_lSzG9RbNOPJeZkrr2NsmI-mPEEXFxHszPnLc_jO-6u_fHdTe6x_MRXfwTtLnWFx3Dxt4GhMO7KULc_d_UP-CPm-gONk' }
    ];
  },

  getDailyChallenge() {
    return {
      title: 'Memory Leak',
      difficulty: 'HARD',
      description: 'A severe memory leak has been detected in the core module. Navigate the fragmented memory grid to isolate and terminate the rogue processes before system failure.',
      rewardXP: 1000,
      rewardItems: ['Exclusive Cyber Avatar', 'Memory Sanitizer Badge'],
      timeRemaining: '14:23:59',
      gridSize: '8x8',
      initialTerminal: [
        '$ ./memory_leak_check',
        'Scanning subsystem 0x4F...',
        'WARNING: 3 memory segments uncommitted.',
        'Objective: Stage all memory blocks and commit to trunk.'
      ]
    };
  }
};
