"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Heart, AlertCircle, Check, RefreshCcw, AlertTriangle } from 'lucide-react';

const MacrodataRefinement = () => {
  // State management
  const [numbers, setNumbers] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [bins, setBins] = useState({
    cozy: { numbers: [], progress: 0 },
    spirits: { numbers: [], progress: 0 },
    chemistry: { numbers: [], progress: 0 },
    future: { numbers: [], progress: 0 }
  });
  const [wellnessMessage, setWellnessMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showCompletionStage, setShowCompletionStage] = useState(0);
  const [showEmotionalBreach, setShowEmotionalBreach] = useState(false);
  const [breachMessage, setBreachMessage] = useState({ title: '', message: '' });
  const [recentCorrectSorts, setRecentCorrectSorts] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStage, setWelcomeStage] = useState(1);

  // Constants
  const specialNumbers = {
    129: {
      title: 'EMOTIONAL DATA BREACH DETECTED',
      message: 'Unauthorized Memory Access: December 9th Protocol\nRecalibrating emotional parameters...\nWarning: Strong rekindling signatures detected',
      bin: 'chemistry'
    },
    433: {
      title: 'STARDEW PROTOCOL VIOLATION',
      message: 'Warning: [Coffee Bean] refinement pattern identified\nStardew Valley comfort levels exceeding workplace standards',
      bin: 'cozy'
    },
    247: {
      title: 'BEVERAGE PROTOCOL BREACH',
      message: 'Caution: [Bee\'s Knees] molecular structure detected\nPlease report to O&D for standard recalibration',
      bin: 'spirits'
    },
    209: {
      title: 'GAMING PROTOCOL ALERT',
      message: 'Warning: Stardew Valley heart event metrics detected\nPlease maintain professional distance from pixels',
      bin: 'cozy'
    },
    202: {
      title: 'FUTURE PLANNING DETECTED',
      message: 'Notice: Binary human reproduction plans identified\nWellness has been notified of your family optimization goals',
      bin: 'future'
    }
  };

  const binCompletionMessages = {
    cozy: {
      title: 'COMFORT METRICS OPTIMIZED',
      message: 'Morning cuddle protocols successfully refined\nStardew Valley reference levels stabilized'
    },
    spirits: {
      title: 'BEVERAGE REFINEMENT COMPLETE',
      message: 'Craft cocktail appreciation properly categorized\nBee\'s Knees enthusiasm appropriately contained'
    },
    chemistry: {
      title: 'ROMANTIC DATA PROCESSED',
      message: 'Street kiss coefficients properly calculated\nCatcall response patterns archived'
    },
    future: {
      title: 'FUTURE PROJECTIONS REFINED',
      message: 'Family planning metrics safely stored\nShared dreams successfully categorized'
    }
  };

  // Special combination triggers
  const checkCombinations = (newBins) => {
    // Check if cozy and chemistry bins are both complete
    if (newBins.cozy.progress === 100 && newBins.chemistry.progress === 100) {
      showBreach(
        'SYNCHRONIZED COMFORT BREACH',
        'Warning: Simultaneous detection of morning cuddles and romantic chemistry\nUnchill behavior imminent'
      );
    }
    // Check if spirits and future bins are both complete
    if (newBins.spirits.progress === 100 && newBins.future.progress === 100) {
        showBreach(
          'TEMPORAL ANOMALY DETECTED',
          'Caution: Future planning algorithms detecting traces of craft cocktails\nPlease refine responsibly'
        );
      }

       // Check if three or more bins are complete
    const completeBins = Object.values(newBins).filter(bin => bin.progress === 100).length;
    if (completeBins >= 3) {
      showBreach(
        'EXCESSIVE REFINEMENT DETECTED',
        'Alert: Multiple emotional categories reaching critical mass\nWellness concerned about your efficiency'
      );
    }
  };

  const wellnessMessages = [
    "NOTICE: Your heart rate indicates acceptable levels of devotion",
    "Remember: Love is productivity, productivity is love",
    "Warning: Mushy content detected in this quadrant",
    "Your romantic metrics are being monitored for your safety",
    "Reminder: Maintain professional distance during refinement",
    "Love is a gift from Kier, cherish it appropriately",
    "Your relationship status has been logged for review",
    "Unchill behavior will be reported to Wellness"
  ];

  const binDescriptions = {
    cozy: "For numbers that feel like morning cuddles and Stardew nights",
    spirits: "For numbers that embody craft cocktails and shared drinks",
    chemistry: "For numbers that capture those special street moments",
    future: "For numbers that feel like your dreams together"
  };

  // Sound effect for successful sort
  const playDing = useCallback(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA==');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  }, []);

  // Initialize numbers and start wellness message rotation
  useEffect(() => {
    if (showWelcome) return; // Don't initialize if welcome screen is showing

    const generateNumbers = () => {
      const specialNums = [129, 433, 247];
      const baseNumbers = Array.from({ length: 13 }, () => {
        let num;
        do {
          num = Math.floor(Math.random() * (1209 - 129 + 1)) + 129;
        } while (specialNums.includes(num));
        return num;
      });
      
      return [...specialNums, ...baseNumbers].map(value => ({
        id: Math.random().toString(36).substr(2, 9),
        value,
        type: ['cozy', 'spirits', 'chemistry', 'future'][Math.floor(Math.random() * 4)]
      }));
    };

    setNumbers(generateNumbers());

    const messageInterval = setInterval(() => {
      const randomMessage = wellnessMessages[Math.floor(Math.random() * wellnessMessages.length)];
      setWellnessMessage(randomMessage);
    }, 5000);

    return () => clearInterval(messageInterval);
  }, [showWelcome]);

  // Welcome screen progression
  useEffect(() => {
    if (showWelcome && welcomeStage < 4) {
      const timer = setTimeout(() => {
        setWelcomeStage(stage => stage + 1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [welcomeStage, showWelcome]);

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
  };

  const showBreach = (title, message) => {
    setBreachMessage({ title, message });
    setShowEmotionalBreach(true);
    setTimeout(() => setShowEmotionalBreach(false), 4000);
  };

  const startCompletionSequence = () => {
    setShowCompletionStage(1);
    setTimeout(() => setShowCompletionStage(2), 3000);
    setTimeout(() => setShowCompletionStage(3), 6000);
    setTimeout(() => setShowCompletionStage(4), 9000);
  };

  const handleBinSelect = (binName) => {
    if (!selectedNumber) return;

    const isCorrect = selectedNumber.type === binName;
    const newBins = { ...bins };
    newBins[binName].numbers.push(selectedNumber);
    newBins[binName].progress = (newBins[binName].numbers.length / 4) * 100;

    setBins(newBins);
    setNumbers(prev => prev.filter(n => n.id !== selectedNumber.id));
    setSelectedNumber(null);

    if (isCorrect) {
      playDing();
      setRecentCorrectSorts(prev => prev + 1);
      
      // Check for special numbers
      if (specialNumbers[selectedNumber.value]) {
        const { title, message } = specialNumbers[selectedNumber.value];
        showBreach(title, message);
      }

      // Check for bin completion
      if (newBins[binName].progress === 100) {
        const completionMessage = binCompletionMessages[binName];
        setTimeout(() => {
          showBreach(completionMessage.title, completionMessage.message);
        }, 1000);
      }

      // Check for special combinations
      checkCombinations(newBins);

      // Check for "unchill" behavior
      if (recentCorrectSorts >= 2) {
        showBreach(
          'WELLNESS ALERT: UNCHILL BEHAVIOR DETECTED',
          'Please regulate your emotional refinement pace\nMushy content levels exceeding workplace standards'
        );
        setRecentCorrectSorts(0);
      }
    }

    setTimeout(() => setRecentCorrectSorts(0), 5000);

    const totalRefined = Object.values(newBins).reduce((sum, bin) => sum + bin.numbers.length, 0);
    if (totalRefined >= 16) {
      setTimeout(() => {
        setIsComplete(true);
        startCompletionSequence();
      }, 4000);
    }
  };

  // Component for the welcome sequence
  const WelcomeScene = () => {
    const stages = {
      1: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-green-500 text-xl font-mono mb-8">
            LUMON INDUSTRIES
          </div>
          <div className="text-white space-y-4">
            <p className="text-sm">MACRODATA REFINEMENT DIVISION</p>
            <p className="text-xs text-gray-400">Special Valentine's Assignment</p>
          </div>
        </div>
      ),
      2: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-green-500 font-mono">
            NOTICE TO REFINERS
          </div>
          <div className="text-white space-y-4">
            <p>Today's refinement involves emotional data processing</p>
            <p className="text-sm text-gray-400">Please maintain appropriate levels of workplace attachment</p>
          </div>
        </div>
      ),
      3: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-green-500 font-mono">
            WELLNESS CHECK
          </div>
          <div className="text-white space-y-4">
            <p>Your emotional readiness has been pre-approved</p>
            <p className="text-sm text-gray-400">Remember: Numbers are not your friends</p>
            <p className="text-xs text-gray-500">(But some might feel familiar)</p>
          </div>
        </div>
      ),
      4: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-green-500 font-mono mb-8">
            BEGIN REFINEMENT
          </div>
          <Heart className="w-12 h-12 text-green-500 mx-auto" />
          <div className="text-sm text-gray-400 mt-8">
            Please select "Begin" to start your special assignment
          </div>
          <button 
            onClick={() => setShowWelcome(false)}
            className="mt-8 px-6 py-3 bg-green-900 text-green-500 rounded hover:bg-green-800 transition"
          >
            Begin
          </button>
        </div>
      )
    };

    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="max-w-md w-full p-8 rounded-lg border-2 border-green-500">
          {stages[welcomeStage]}
        </div>
      </div>
    );
  };

  // Component for the completion sequence
  const CompletionScene = () => {
    const stages = {
      1: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-green-500 text-xl font-mono">
            REFINEMENT COMPLETE
          </div>
          <div className="text-sm text-gray-400">
            Processing emotional data...
          </div>
          <RefreshCcw className="w-8 h-8 text-green-500 mx-auto animate-spin" />
        </div>
      ),
      2: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-green-500 font-mono">
            NOTICE TO EMPLOYEE #4277
          </div>
          <div className="text-white space-y-4">
            <p>Your innie wishes to inform your outie:</p>
            <p className="text-2xl">"Even in severance, her heart recognizes you"</p>
          </div>
        </div>
      ),
      3: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-green-500 font-mono">
            OUTIE RESPONSE RECEIVED
          </div>
          <div className="text-white space-y-4">
            <p>Message authorized by Wellness:</p>
            <p className="text-2xl">"Both versions of me love both versions of you"</p>
          </div>
        </div>
      ),
      4: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-green-500 font-mono mb-8">
            HAPPY VALENTINE'S DAY
          </div>
          <Heart className="w-16 h-16 text-green-500 mx-auto animate-pulse" />
          <div className="text-sm text-gray-400 mt-8">
            This message has been approved by the Lumon Love & Devotion Department
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-4 py-2 bg-green-900 text-green-500 rounded hover:bg-green-800 transition"
          >
            Return to Work
          </button>
        </div>
      )
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        {stages[showCompletionStage]}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-300 font-mono">
      {showWelcome ? (
        <WelcomeScene />
      ) : (
        <>
          {showEmotionalBreach && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fade-in">
              <div className="text-center space-y-4 p-8 border-2 border-red-500 bg-gray-900">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
                <h2 className="text-red-500 text-xl">{breachMessage.title}</h2>
                <pre className="text-green-500 whitespace-pre-line">{breachMessage.message}</pre>
              </div>
            </div>
          )}

          {showCompletionStage > 0 && <CompletionScene />}

          <div className="max-w-sm md:max-w-md w-full p-4 md:p-8 rounded-lg border-2 border-green-500">
            <div className="text-center mb-8 h-8">
              <p className="text-green-500 animate-fade mb-8">{wellnessMessage}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Numbers Display */}
              <Card className="bg-gray-800 p-3 md:p-4 border-gray-700">
                <h2 className="text-base md:text-lg mb-4 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-green-500" />
                  Available Numbers
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4">
                  {numbers.map(number => (
                    <button
                      key={number.id}
                      onClick={() => handleNumberSelect(number)}
                      className={`relative p-4 border ${
                        selectedNumber?.id === number.id 
                          ? 'border-green-500 bg-gray-700' 
                          : 'border-gray-600 hover:border-green-900'
                      } transition-colors`}
                    >
                      {number.value}
                      {selectedNumber?.id === number.id && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Bins Display */}
              <Card className="bg-gray-800 p-3 md:p-4 border-gray-700">
                <h2 className="text-lg mb-4 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-green-500" />
                  Emotional Categorization
                </h2>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {Object.entries(bins).map(([binName, bin]) => (
                    <button
                      key={binName}
                      onClick={() => handleBinSelect(binName)}
                      className="relative p-4 border border-gray-600 hover:border-green-900 transition-colors"
                      title={binDescriptions[binName]}
                    >
                      <div className="text-sm capitalize mb-2">{binName}</div>
                      <div className="h-2 bg-gray-700 rounded">
                        <div 
                          className="h-full bg-green-500 rounded transition-all duration-500"
                          style={{ width: `${bin.progress}%` }}
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes fade {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.3; }
        }
        .animate-fade {
          animation: fade 4s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MacrodataRefinement;