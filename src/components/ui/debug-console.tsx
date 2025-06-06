"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

const DebugConsoleContext = React.createContext<DebugConsole | undefined>(
  undefined,
);

interface FeatureFlagOptions<T extends readonly string[]> {
  label: string;
  descriptions?: string;
  values: T;
}
interface Observable<T> {
  value: T;
  onChange(handler: (latest: T) => void): () => void;
}

class FeatureFlag<T extends readonly string[]>
  implements FeatureFlagOptions<T>, Observable<T[number]>
{
  label: string;
  descriptions?: string | undefined;
  values: T;

  private currentValue: T[number];
  private handlers = new Set<(latest: T[number]) => void>();
  set value(val: T[number]) {
    this.currentValue = val;
    this.handlers.forEach((handler) => handler(val));
  }
  get value() {
    return this.currentValue;
  }

  constructor(options: FeatureFlagOptions<T>) {
    this.values = options.values;
    this.descriptions = options.descriptions;
    this.currentValue = options.values[0];
    this.label = options.label;
  }

  onChange(handler: (latest: T[number]) => void) {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }
}

export function options<const T extends readonly string[]>(arr: T): T {
  return arr;
}

export function useFeatureFlag<T extends readonly string[]>(
  options: FeatureFlagOptions<T>,
) {
  const context = useContext(DebugConsoleContext);
  if (!context) {
    throw "DebugConsoleContext not found for useFeatureFlag, make sure it is inside <DebugConsoleProvider>";
  }

  // this will not change unless deep comparision says they are different
  const frozenOptionValueRef = useRef(options.values);
  for (let i = 0; i < options.values.length; i++) {
    if (options.values[i] !== frozenOptionValueRef.current[i]) {
      console.log("changed!");
      frozenOptionValueRef.current = options.values;
      break;
    }
  }
  const deepComparedValueOption = frozenOptionValueRef.current;

  const [val, setVal] = useState<T[number]>(options.values[0]);
  useEffect(() => {
    const featureFlag = new FeatureFlag({
      descriptions: options.descriptions,
      values: deepComparedValueOption,
      label: options.label,
    });

    const cleanup = featureFlag.onChange((latest) => {
      setVal(latest);
      URLState.set(featureFlag.label, latest);
    });
    context.addFlag(featureFlag);

    featureFlag.value = URLState.get(featureFlag.label) || featureFlag.value;

    return () => {
      cleanup();
      context.removeFlag(featureFlag);
    };
  }, [context, options.descriptions, options.label, deepComparedValueOption]);
  return val;
}

class DebugConsole {
  readonly _interanl_flags = new Set<FeatureFlag<readonly string[]>>();

  private refreshReact: () => void;

  constructor(refreshReact: () => void) {
    this.refreshReact = refreshReact;
  }

  addFlag<T extends readonly string[]>(flag: FeatureFlag<T>) {
    this._interanl_flags.add(flag as unknown as FeatureFlag<readonly string[]>);
    this.refreshReact();
    console.log("added:", this._interanl_flags);
  }

  removeFlag<T extends readonly string[]>(flag: FeatureFlag<T>) {
    this._interanl_flags.delete(
      flag as unknown as FeatureFlag<readonly string[]>,
    );
    console.log("removed:", flag);
    this.refreshReact();
  }
}

class URLState {
  public static set(key: string, value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState(null, "", url.toString());
  }

  public static get(key: string): string | undefined {
    return new URL(window.location.href).searchParams.get(key) ?? undefined;
  }
}

const DebugConsoleProvider = ({ children }: React.PropsWithChildren) => {
  const [, refreshReact] = useState(0);
  const debugConsole = useMemo(
    () =>
      new DebugConsole(() =>
        refreshReact((prev) => {
          return (prev += 1);
        }),
      ),
    [],
  );
  const featureListContentRef = useRef<HTMLDivElement>(null);
  const [featureListHeight, setFeatureListHeight] = useState(0);

  useEffect(() => {
    const list = featureListContentRef.current;
    if (!list) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const height =
        entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect?.height ?? 0;
      setFeatureListHeight(height);
    });

    observer.observe(list);

    return () => {
      observer.disconnect();
    };
  }, []);

  const [shouldShowFeatureList, setShouldShowFeatureList] = useState(true);
  useEffect(() => {
    const shouldShow = URLState.get("should-show-feature-list") === "true";
    setShouldShowFeatureList(shouldShow);
  }, []);

  useEffect(() => {
    URLState.set("should-show-feature-list", `${shouldShowFeatureList}`);
  }, [shouldShowFeatureList]);

  return (
    <DebugConsoleContext.Provider value={debugConsole}>
      <div className="fixed right-4 bottom-4 z-[10000000] max-w-128 rounded-md bg-zinc-900/80 p-1 shadow-md text-sm text-zinc-200 backdrop-blur-2xl">
        <button
          onClick={() => setShouldShowFeatureList((prev) => !prev)}
          className="flex w-full cursor-pointer flex-row gap-4 px-2 py-1 text-xs tracking-wider uppercase"
        >
          <span className="opacity-60">
            Experiments ({debugConsole._interanl_flags.size})
          </span>
          <span className="ml-auto uppercase opacity-60">
            {shouldShowFeatureList ? "-" : "+"}
          </span>
        </button>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ height: shouldShowFeatureList ? featureListHeight : 0 }}
        >
          <div ref={featureListContentRef} className="pt-2">
            {Array.from(debugConsole._interanl_flags).map((flag, index) => {
              return <OptionEditor flag={flag} key={index} />;
            })}
          </div>
        </div>
      </div>
      {children}
    </DebugConsoleContext.Provider>
  );
};

interface EditorProps {
  flag: FeatureFlag<readonly string[]>;
}

const OptionEditor = ({ flag }: EditorProps) => {
  const [value, setValue] = useState(flag.value);

  useEffect(() => {
    const unobserve = flag.onChange((latest: string) => {
      setValue(latest as string);
    });
    return () => {
      unobserve();
    };
  }, [flag]);

  const [isHovering, setIsHovering] = useState(false);
  const [shouldShowTips, setShouldShowTips] = useState(false);

  useEffect(() => {
    if (isHovering) {
      const timeout = setTimeout(() => setShouldShowTips(true), 500);
      return () => {
        clearTimeout(timeout);
      };
    }
    setShouldShowTips(false);
  }, [isHovering]);
  return (
    <>
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative flex flex-row items-center justify-between gap-8 rounded-sm px-2 py-1 hover:bg-zinc-800"
      >
        <div className="flex flex-col">
          {flag.descriptions && (
            <div className="absolute bottom-0 left-0">
              <div
                className={`pointer-events-none absolute right-2 bottom-0 w-[500px] max-w-[32ch] rounded-md bg-zinc-800 text-xs drop-shadow-2xl transition-all duration-150 ease-out ${
                  shouldShowTips
                    ? "translate-x-0 scale-100 opacity-100"
                    : "translate-x-4 scale-95 opacity-0"
                }`}
              >
                <div className="border-b border-b-zinc-700 px-3 py-2">
                  <p className="mb-1 text-sm">{flag.label}</p>
                  <p className="opacity-70">{flag.descriptions}</p>
                </div>
                <div className="flex flex-col px-3 py-2 opacity-70">
                  Options: {flag.values.toString().trim()}
                </div>
              </div>
            </div>
          )}
          <label>{flag.label}</label>
          <p className="text-xs opacity-70">{flag.value}</p>
        </div>
        <ChevronDown className="size-4" />
        <select
          className="absolute inset-0 opacity-0"
          value={value}
          onMouseDown={() => setShouldShowTips(false)}
          onChange={(e) => {
            const newValue = e.target.value;
            flag.value = newValue;
            setValue(newValue);
          }}
        >
          {flag.values.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

const ChevronDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default DebugConsoleProvider;
