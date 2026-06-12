<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Codeblock from '$lib/components/Codeblock.svelte';
    import TextField from '$lib/components/TextField.svelte';
    import { mathJaxTypeset } from '$lib/mathjax/mathjax.global.svelte';
    import { getContext } from 'svelte';
    import { header } from '../WriteupContent.svelte';
    import type { PageProps } from './$types';
    import Link from '$lib/components/Link.svelte';
    import Spoiler from '$lib/components/Spoiler.svelte';
    import { giveBadge } from '$lib/badges/badges';

    let { data }: PageProps = $props();

    let options = getContext<{ swearing: boolean }>("options");

    let a_2 = $state(""), a_1 = $state(""), a_0 = $state("");
    let hasCorrectMath: boolean | undefined = $state(undefined);

    $effect(() => {
        if (options.swearing) {
            mathJaxTypeset();
        }

        if (!options.swearing) {
            mathJaxTypeset();
        }
    });

    function onMathSubmit() {
        if (a_2 === "4" && a_1 === "-4" && a_0 === "2"
                && hasCorrectMath === undefined || hasCorrectMath === false) {
            // they got the righjt answer wohoo
            hasCorrectMath = true;
            giveBadge("math_genius");
        } else {
            hasCorrectMath = false;
        }
    };
</script>

<p>Has ANYONE ever wondered... if we can store hidden messages in polynomial
  functions? or is it just me?</p>
<p>I&#39;m in my Math class, bored and sitting just taking notes -- learning all
  about what a polynomial is. </p>
<p>I consider my Math teacher really good at teaching! I&#39;m really, really
  glad to have such a teacher that <strong>actually</strong> teaches a subject
  with such intent of actually learning and using our critical thinking skills.
  Trust me, our expectations were low -- there were teachers that did NOT even
  teach the subject they were supposed to teach at all.</p>
<p>But anyway, we were in the middle of learning about trying to derive a
  polynomial from system of equations, you know, deriving a polynomial from
  given a set of points $(x, f(x))$. At this point, I think I&#39;m just getting
  shown pretty cool tricks and it amazed me that I could derive a polynomial
  myself from a set of any given points.</p>
<p><em>By the way, I just want to stress out, I am recalling the past which I
    might gaslight myself leading to false information about my memories.
    I&#39;m starting to forget things, which is really {options.swearing ? "fucking" : "dreadfully"} scary and I
    don&#39;t like it.</em></p>
<p>That&#39;s when I got an idea. I was bored, and I was thinking about what I
  would do to get home, what to program next... </p>
<p>Based on what I just learned now, what if I put &quot;data&quot; inside a
  polynomial? What if I put a file in a polynomial? Would that work?</p>
<p>Me in January 2024 was about to try this and I actually got it to work!
</p>
<p>But first, how this this all work?</p>
{@render header(2, "Prerequisite Knowledge")}
<p>Alright, I&#39;ll give a small refresher about some high school algebra and
  frame the definitions in the context of what I have in mind and this project.
</p>
<p>I&#39;m ~80% sure that if you found this writeup, you may know the
  definitions of what a &quot;function&quot; is or what a &quot;polynomial&quot;
  is, or you know already know advanced algebra and higher-level math. I&#39;ll
  just lay out the definitions here in the <strong>context of this
    project</strong>.</p>
<p><em>And Math lords, please forgive me if my definitions seem incorrect.
    Provide valid criticism, as long as it&#39;s <strong>constructive</strong>,
    and scream at my <Link
      href="https://github.com/brickwall2900/brickwall2900.github.io/issues">GitHub
      Issues</Link> if anything is wrong.</em></p>
{@render header(3, "Functions")}
<p>A function takes an input, transforms it through an expression, and whatever
  returns from that expression is the output. They are typically one-to-one
  relations, or many-to-one relations, meaning that it takes one or many inputs
  and produces one output.<br>$$f(x) = x + 1$$<br>This function takes a variable
  $x$, then just adds a constant $1$ to it. If I do $f(2)$, the output should be
  $3$, since substituting $x$ as $2$ becomes $2 + 1$, and $2 + 1$ is $3$.</p>
<p>Another example: $$f(x)=6x^2+7x$$<br>Given $x = 21$, $f(x)$ would be $2793$,
  evaluating the expression with $x$ as $21$.</p>
{@render header(3, "Polynomials")}
<p>So you know this function? $$f(x)=6x^2+7x$$<br>This function can be broken
  down into individual <strong>terms</strong>. Specifically, both $6x^2$ and
  $7x$ are &quot;terms&quot;. A term is defined as a constants, variables, or
  both as a product. $x$ is a valid term, so does $3$, $\frac 9 2$, $-3xy$, and
  $4x^3$, they all fit under the definition of a term.</p>
<p><strong>Like terms</strong> are two or more terms that has the same variables
  but their <strong>coefficients</strong> (the constant multiplied to a
  variable) differ. $3x$ and $5x$ are both like terms. $6x$ and $7y$ are
  <strong>unlike</strong> terms, they differ in variables. $4x^2$ and $5x$ are
  <strong>unlike terms</strong>, since they differ in <strong>degree</strong>
  (the largest exponent in one variable).</p>
<p>A &quot;polynomial&quot; then is a group of many terms. The function defined
  previously above is a polynomial (and it is specifically called a
  <strong>polynomial function</strong>, but we&#39;ll only call these
  <strong>polynomials</strong> in this writeup), and the given function is what
  we call a <strong>&quot;binomial&quot;</strong>, since it has two unlike
  terms.</p>
<p>Mathematically though, a polynomial is defined as: $$f(x)=a_n \cdot x^n +
  a_{"{n-1}"} \cdot x^{"{n-1}"} + a_{"{n-2}"} \cdot x^{"{n-2}"} + \ldots + a_1 \cdot x +
  a_0$$<br>where $a_n$ through $a_0$ are the coefficients for the variable $x^n$
  through $x^0$.</p>
{#if options.swearing}
{@render header(2, "How the fuck do I get a polynomial given a list of $x$ and $f(x)$?")}
{:else}
{@render header(2, "How on earth do I get a polynomial given a list of $x$ and $f(x)$?")}
{/if}
<p>This is a pretty important part of storing data into polynomials. We would
  like to be able to <strong>&quot;derive&quot;</strong> a polynomial by
  having numbers $x$ and retrieve some data from $f(x)$. </p>
<p>In other words, <strong>derive</strong> a polynomial from a set of points
  $(x, f(x))$, such that $f(x_1)=x_1$, $f(x_2)=x_2$, and so on in however many
  points are in that set.</p>
<p>You think $f(x)$ returns a number from $x$ being transformed as such by an
  expression, well, we can interpret it as a data point via however we can
  imagine. We&#39;ll first learn how to derive a polynomial though.</p>
{@render header(3, "First Example")}
<p>Lets... think of this first in the most simplest way possible. Given a
  polynomial $f(x)$:<br>$$f(x)=4x+6$$<br>It has two terms, takes any value of
  $x$ and gives an output of $f(x)$. Let&#39;s say we&#39;re putting numbers $6$
  and $7$ as $x$ in there.<br>$$f(6)=4(6)+6=30$$<br>$$f(6)=4(7)+6=34$$<br>The
  result of each of the two numbers as inputs are $30$ and $34$ respectively.
</p>
<p>...</p>
<p>Now <strong>forget about the given polynomial.</strong></p>
<p>Let&#39;s say we&#39;re given points $(6, 30)$ and $(7, 34)$. How would I get
  the underlying polynomial such that the abscissas (the x-coordinate), gives us
  exactly the ordinate (y-coordinate) for each point? </p>
<p>In other words: <strong>find a polynomial $f(x)$ that holds the following
    true:</strong> $f(6) = 30$ and $f(7) = 34$.</p>
<p>How do we do that? We can&#39;t just bruteforce every polynomial... Luckily,
  there&#39;s a proper mathematical way to do this.</p>
<p><em>We won&#39;t do the $y=mx+b$ stuff here or pull out any linear equation
    tricks, since even though it&#39;s a linear equation, we want to solve this
    in a polynomial {#if options.swearing} ahh {:else} like {/if} way.</em></p>
<p>We know we&#39;ve been given two inputs, $6$ and $7$. We can extract a
  <strong>binomial</strong> here, since two inputs = two terms. If we were given
  three inputs, then we get a <strong>trinomial</strong> or three terms of
  polynomial.<br>A binomial takes a form of this:<br>$$f(x) = a_1 \cdot x +
  a_0$$<br>The variable $x$ is just already there, we only need to solve the
  coefficients such that these inputs could be made true. $a_1$ and $a_0$ are
  both missing variables here.</p>
<p>Introducing: <Spoiler><strong>Systems of Equations</strong></Spoiler>!!</p>
<p>We could express both inputs and output as equations that we need to be solve
  to solve for the coefficients:<br>$$34=a_1 \cdot 7 + a_0$$<br>$$30=a_1 \cdot 6
  + a_0$$<br>Again, $a_1$ and $a_0$ are both missing variables here. Using the
  systems of equations, we could solve for both missing variables and get the
  final equations that satisfy all inputs.</p>
<p>Eliminating $a_0$ through subtracting the two equations, we are left with the
  result<br>$$4=a_1$$<br>And there we go! $a_1$ was solved!<br>Time to solve for
  $a_0$:<br>$$34=4(7)+a_0$$<br>$$34=28+a_0$$<br>$$6=a_0$$<br>And there we go!
  Substituting those coefficients back into our binomial form gives
  us:<br>$$f(x)=4x+6$$<br>Looks just like our original given polynomial. We solved it!
</p>
<hr>
{@render header(3, "Second Example")}
<p>Let&#39;s say we&#39;re given points $(0, 2)$, $(6, 122)$, and $(7, 170)$,
  and we don&#39;t have a polynomial this time. How would I get the underlying
  polynomial such that the abscissas (the x-coordinate), gives us exactly the
  ordinate (y-coordinate) for each point? </p>
<p>In other words: <strong>find a polynomial $f(x)$ that holds the following
    true:</strong> $f(0)=2$, $f(6) = 122$, and $f(7) = 170$.</p>
<p>It has three inputs, meaning the polynomial we could extract has three
  possible terms. Meaning its form looks like this:<br>$$f(x)=a_2 \cdot x^2 +
  a_1 \cdot x + a_0$$<br>Using the same-old trick as before, systems of
  equations come really handy in doing this type of stuff.</p>
<p>$$2=a_2 \cdot 0^2 + a_1 \cdot 0 + a_0$$<br>can be simplified to
  $2=a_0$<br>$$122=a_2 \cdot 6^2 + a_1 \cdot 6 + a_0$$<br>$$170=a_2 \cdot 7^2 +
  a_1 \cdot 7 + a_0$$<br>This isn&#39;t the systems of linear equations we did
  earlier, these are like quadratic equations this time.</p>
<p>Anyway, attempting to write here on how I solved the systems of equations feels
  like I&#39;m writing homework, so I&#39;ll make it YOUR homework. Please solve
  these systems of equations, to get absolutely nothing in return.</p>
<p>Please write the answer:</p>
<div class="grid grid-cols-2 gap-2">
    <p tabindex="-1">$a_2$</p>
    <TextField bind:value={a_2} />
    
    <p tabindex="-1">$a_1$</p>
    <TextField bind:value={a_1} />

    <p tabindex="-1">$a_0$</p>
    <TextField bind:value={a_0} />

    <Button class="col-span-2" onclick={onMathSubmit}>Submit</Button>
</div>
{#if hasCorrectMath === true}
    <p>So yeah, that&#39;s how we can solve for polynomials. Try evaluating the polynomial yourself with the exact values!</p>
    <p class="text-green-600 font-bold">Congratulations for solving the problem by the way! {":)"}</p>
{:else if hasCorrectMath === false}
    <p class="text-red-600 font-bold">Sorry, but the answer is incorrect.</p>
{/if}
{@render header(3, "Writing Actual Code")}
<p>I&#39;ll just dump the actual code here:</p>
<Codeblock filename="Main.java" language="java" code={`
package com.github.brickwall2900;

import org.apache.commons.math3.analysis.polynomials.PolynomialFunction;
import org.apache.commons.math3.linear.*;

// I got inspired by my math teacher!
// okay we could theoretically implement this in Python with no float imprecision whatsoever...
// you know, Python is pretty great for doing math stuff like this
public class Main {
    public static void main(String[] args) {
        String data = "I miss you, ???..."; // no she didn't die lol
        // but I really, really miss her ;(

        encode("Hello, world!");

        String data2 = "Did we encode a message within a polynomial? Floats and Doubles are really imprecise man..."; // corrupts text since float imprecision
        String data3 = "If we can somehow find a better way";
        String data4 = " of putting data into polynomials";
        String data5 = " and getting around the pesky";
        String data6 = " float imprecision, this'll might work!";
        String data7 = "The sky is our limit!";
//        double[] coefficients = encode(data2);
//        System.out.println(decode(coefficients));
        double[] c1 = encode(data3), c2 = encode(data4), c3 = encode(data5), c4 = encode(data6);
        double[] c5 = encode(data7);
        System.out.println(decode(c1) + decode(c2) + decode(c3) + decode(c4));
        System.out.println(decode(c5));

        int iter = 0;
        int max = 0;
        for (int i = 1; i <= 1000; i++) {
            System.out.println("Testing string with length " + i);
            StringBuilder sb = new StringBuilder();
//            for (int j = 0; j < i; j++) sb.append((char)((j % 26) + 65));
            for (int j = 0; j < i; j++) sb.append('A');
            String original = sb.toString();
            double[] encoded = encode(original);
            String decoded = decode(encoded);
            System.out.println(decoded);

            int k = 0;
            while (k < decoded.length() && k < original.length()) {
                char a = original.charAt(k);
                char b = decoded.charAt(k);
                if (a != b) {
                    break;
                }
                k++;
            }
            if (max <= k) {
                iter = i;
            }
            max = Math.max(max, k);
            System.out.println(String.format("Maximum: %d; Iteration: %d", k, i));
        }
        System.out.println(String.format("Overall Maximum: %d; Iteration: %d", max, iter));
    }

    /**
     * Encode a {@code data} to a bunch of polynomial coefficients that the first term
     * P(0) will be the number of bytes of the data, and P(1...n) will be the data packed
     * in integers.
     * @param data input data
     * @return polynomial coefficients
     * @apiNote This method doesn't guarantee that the data matches one-to-one that has
     *          been encoded to a polynomial since the coefficients are bound to float imprecision.
     */
    public static double[] encode(String data) {
        byte[] bytes = data.getBytes();

        // align the data to a multiple of four 
        int count = (int) Math.ceil((float)bytes.length / Integer.BYTES);
        byte[] aligned = new byte[count * Integer.BYTES];
        System.arraycopy(bytes, 0, aligned, 0, bytes.length);

        // pack 4 bytes to integers
        int[] grouped = new int[count + 1];
        grouped[0] = count * Integer.BYTES; // first term become the length of data
        for (int i = 1, c = 0; i < count + 1; i++) {
            int e = aligned[c] << 24 | (aligned[c + 1] & 0xFF) << 16 | (aligned[c + 2] & 0xFF) << 8 | (aligned[c + 3] & 0xFF);
            c += 4;
            grouped[i] = e;
        }

        // create matrix of coefficients
        double[][] coefficients = new double[count + 1][];
        coefficients[0] = new double[count + 1];
        coefficients[0][count] = 1;
        for (int c = 1; c < count + 1; c++) {
            coefficients[c] = new double[count + 1];
            for (int i = 0; i < count + 1; i++) {
                coefficients[c][i] = Math.pow(c, count - i);
            }
        }

        // initialize solver then solve the linear of system equations
        // Polynomial P(x) is represented as P(x) = a(n)x^n + a(n-1)x^(n-1) + ... + a1x + a0
        // where a(i) are the coefficients found by solving the system of linear equations.
        // P(0) returns the number of bytes in the data
        // P(1), P(2), P(n) returns the packed integers
        RealMatrix mCoefficients = new Array2DRowRealMatrix(coefficients, false);
        DecompositionSolver mSolver = new LUDecomposition(mCoefficients,0).getSolver();
        // copy to another array from int[] -> double[]
        double[] eq = new double[count + 1];
        for (int i = 0; i < count + 1; i++) {
            eq[i] = grouped[i];
        }
        RealVector mEq = new ArrayRealVector(eq, false);
        RealVector mSolution = mSolver.solve(mEq);

        // return as string whatever bla bla bla
        StringBuilder sb = new StringBuilder();
        int dim = mSolution.getDimension();
        for (int i = 0; i < dim; i++) {
            sb.append(String.format("%.10f", mSolution.getEntry(i)));
            int exp = dim - i - 1;
            if (exp != 0) {
                sb.append("x^").append(dim - i - 1);
            }
            if (i < dim - 1) sb.append(" + ");
        }
//        System.out.println(sb);
        double[] array = mSolution.toArray();
//        System.out.println(Arrays.toString(array));
        return array;
    }

    /**
     * Decode the polynomial function P(x) with given coefficients into actual data.
     * @param coefficients for polynomial
     * @return data extracted from polynomial
     * @apiNote This method doesn't guarantee that the data matches one-to-one that has
     *          been encoded to a polynomial since the coefficients are bound to float imprecision.
     */
    public static String decode(double[] coefficients) {
        PolynomialFunction function = new PolynomialFunction(reverse(coefficients));
        // get number of bytes from P(0), since that's where the number of bytes are stored.
        int byteCount = (int) function.value(0);

        // we're getting how many terms we should multiply
        // but why didn't I do coefficients.length - 1?
        int polyCount = byteCount / Integer.BYTES;

        // here, we're getting the packed bytes from the polynomial (P(n) -> packed integer)
        int[] decodedStage1 = new int[polyCount];
        for (int i = 1; i < polyCount + 1; i++) {
            decodedStage1[i - 1] = (int) Math.round(function.value(i));
        }
//        System.out.println(Arrays.toString(decodedStage1));

        // unpacking integer to bytes
        byte[] decodedStage2 = new byte[byteCount];
        for (int i = 0, j = 0; i < decodedStage1.length; i++) {
            int packed = decodedStage1[i];
            decodedStage2[j] = (byte) (packed >> 24);
            decodedStage2[j + 1] = (byte) (packed >> 16);
            decodedStage2[j + 2] = (byte) (packed >> 8);
            decodedStage2[j + 3] = (byte) packed;
            j += 4;
        }
        // we got it!
        return new String(trimZeroes(decodedStage2));
    }

    // trim the zeros at the end of the byte array
    private static byte[] trimZeroes(byte[] input) {
        int testPointer = 0, pointer = 0;
        for (int i = 0; i < input.length; i++) {
            if (input[testPointer] != 0) {
                pointer = ++testPointer;
            } else {
                testPointer++;
            }
        }
        byte[] output = new byte[pointer];
        System.arraycopy(input, 0, output, 0, pointer);
        return output;
    }

    // reverses an array?
    // what do you think it does? eat it?
    private static double[] reverse(double[] input) {
        double[] newArray = new double[input.length];
        for (int i = input.length - 1; i >= 0; i--) {
            newArray[input.length - i - 1] = input[i];
        }
        return newArray;
    }
}
`} />
<p>There it is. I&#39;ll just explain what&#39;s here and explain how I encode
  and decode data from a polynomial.</p>
{@render header(3, "Encoding the Polynomial")}
<p>Given a message <code>Hello, world!</code>, we need to encode a polynomial
  containing this message such that we can decode from it.</p>
<p>The polynomial I would be deriving looks like
  this:<br>$f(0)=$<code>aligned length of the data</code><br>$f(1 \ldots n)=$
  <code>data itself, bytes packed in integers</code></p>
<p>The <code>bytes packed in integers</code> part means 4 bytes are packed in
  one single <code>int</code>, since that is the size of an <code>int</code>.
</p>
<p><em>Remember that a computer <code>int</code> is completely different from
    the mathematical integer! A mathematical integer can represent any integer
    $i$ on a number line such that the number is positive or negative with no
    decimal points. A computer <code>int</code> can also act as a mathematical
    integer, but due to memory constraints, an <code>int</code> is only 4 bytes
    in total, meaning an <code>int</code> can only represent $2^{"{32}"}$ possible
    values while a mathematical integer can represent infinitely many possible
    values!</em></p>
<p>So when I decode it, I take $f(0)$ to get the size of the data, define $n$ as
  $f(0) \div 4$, then evaluate the corresponding $f(1)$ through $f(n)$. The
  resulting integers we get through $f(1 \ldots n)$ will be unpacked into 4
  bytes, and that&#39;s how we get our data back.</p>
<p>So when we&#39;re solving for the data string <code>Hello, world!</code>
  (assuming it&#39;s ASCII bytes here), then we take the size of the string
  first (13 bytes).<br>Next, we need to calculate the <strong>aligned length of
    the data</strong>, in other words, $f(0)$. This is the count in which we
  read from the polynomial to get the packed bytes.<br>The calculation goes
  like<br><code>f(0) = ceil(length_of_data / Integer.BYTES) *
    Integer.BYTES</code><br>or<br><code>f(0) = ceil(length_of_data / 4) *
    4</code> since an <code>int</code> is 4 bytes.</p>
<p>Using the 13 bytes we have, $f(0)$ will now be <code>ceil(13 / 4) * 4</code>
  or <code>16</code>; Let&#39;s keep that in a temporary variable.</p>
<p>Now we need to pack the actual data into <code>int</code>s. The bytes from
  <code>Hello, world!</code> are ASCII codepoints. Refer to the <Link
    href="https://www.asciitable.com/">ASCII Table</Link> to see an entire table
  full of ASCII codepoints.<br>Pack the first 4 bytes: <code>[0x48, 0x65, 0x6C,
    0x6C] -&gt; 1214606444</code><br>Pack the next 4 bytes: <code>[0x6F, 0x2C,
    0x20, 0x77] -&gt; 1865162871</code><br>Pack the next 4 bytes: <code>[0x6F,
    0x72, 0x6C, 0x64] -&gt; 1869769828</code><br>Pack the last 4 bytes. The
  remaining bytes after the actual data will just be <code>0</code>:
  <code>[0x21, 0x00, 0x00, 0x00] -&gt; 553648128</code><br>We don&#39;t pack the
  next 4 bytes after this since there is no more data remaining.</p>
<p>Put all the results into an array <code>a</code>: <code>[16, 1214606444,
    1865162871, 1869769828, 553648128]</code>.<br>This array would be our
  outputs of the polynomial function, $f(x)$.<br><code>a[0]</code> would be
  $f(0)$,<br><code>a[1]</code> would be $f(1)$,<br><code>a[2]</code> would be
  $f(2)$, and so on.</p>
<p>Technically, we already have the inputs of the polynomial function too, that
  being the indices of the array, from <code>0</code> to
  <code>a.length - 1</code>.<br>It&#39;s now time to derive a polynomial with
  what we already have!</p>
<pre><code>DecompositionSolver mSolver = new LUDecomposition(mCoefficients,0).getSolver();  
...
RealVector mEq = new ArrayRealVector(eq, false);  
RealVector mSolution = mSolver.solve(mEq);  
</code></pre>
<p>Being honest with you, I have no idea what this all does. Even though I
  explained how to derive a polynomial with given inputs and outputs, I
  don&#39;t know what an <code>LUDecomposition</code> does, all I know is that
  it does some magic stuff with matrices and it solves the systems of equations
  for me.</p>
<p>Anyway, solving the coefficients gives us the coefficients of the polynomial,
  from $a_4$ to $a_0$:<br><code>[-2.470332158333331E7, 1.3457001799999973E8,
    -5.128118034166658E8, 1.6175515349999993E9, 16.0]</code><br>That makes
  absolutely no sense, here&#39;s the polynomial in another
  notation:<br>$$f(x)=(-2.470332158333331\times
  10^7)(x^4)+(1.3457001799999973\times 10^8)(x^3)+(-5.128118034166658\times
  10^8)(x^2)+(1.6175515349999993\times 10^9)(x)+16$$<br>Also makes no sense, but
  let&#39;s try evaluating it, through $f(0)$ through $f(\frac {"{f(0)}"}
  {4})$...<br>$f(0)=16$<br>$f(1)=1214606444$<br>$f(2)=1865162871$<br>$f(3)=1869769828$<br>$f(4)=553648128$<br>So
  yeah, that&#39;s pretty accurate to what we got before! Nice!</p>
{@render header(3, "Decoding the Polynomial")}
<p>Given what we had before:<br>$$f(x)=(-2.470332158333331\times
  10^7)(x^4)+(1.3457001799999973\times 10^8)(x^3)+(-5.128118034166658\times
  10^8)(x^2)+(1.6175515349999993\times 10^9)(x)+16$$<br>How should we decode
  this? We&#39;ll, let&#39;s go through the reverse of encoding this!</p>
<p>Lets evaluate the polynomial through $f(0)$ first.<br>$f(0)=16$<br>Okay, now
  we evaluate $f(1)$ through $f(4)$. Remember that $f(0)$ is the aligned length
  of our data, and our data is packed within the polynomial as
  <code>int</code>s, so we have to read <code>int</code>s from the polynomial by
  defining <code>n</code> as the length of our packed data. <code>n</code> is
  $f(0) \div 4$ since an <code>int</code> is 4
  bytes.<br>$f(1)=1214606444$<br>$f(2)=1865162871$<br>$f(3)=1869769828$<br>$f(4)=553648128$
</p>
<p>Now, we try to unpack the data:<br>Unpack the first 4 bytes: <code>1214606444
    -&gt; [0x48, 0x65, 0x6C, 0x6C]</code><br>Unpack the next 4 bytes:
  <code>1865162871 -&gt; [0x6F, 0x2C, 0x20, 0x77]</code><br>Unpack the next 4
  bytes: <code>1869769828 -&gt; [0x6F, 0x72, 0x6C, 0x64]</code><br>Unpack the
  last 4 bytes. <code>553648128 -&gt; [0x21, 0x00, 0x00, 0x00]</code></p>
<p>Then we concatinate our bytes together: <code>[0x48, 0x65, 0x6C, 0x6C, 0x6F,
    0x2C, 0x20, 0x77, 0x6F, 0x72, 0x6C, 0x64, 0x21, 0x00, 0x00,
    0x00]</code><br>To get our final result: <code>Hello,
    world![NUL][NUL][NUL]</code></p>
<p>There are NUL bytes at the end and we need to get rid of them, we'll use a helper method to
  remove the trailing NUL bytes.</p>
<p>The final result is: <code>Hello, world!</code></p>
{@render header(3, "Limitations and Room for Improvement")}
<p>This algorithm I have of encoding and decoding bytes by all means, has a lot
  more room for improvement. The length of actual data may be stored in the
  first term, similar to how I pack 4 bytes to an <code>int</code> so we can
  avoid NUL bytes at the end of the message. </p>
<p>And putting long text into this algorithm completely breaks it actually...
</p>
<p>Due to what I believe is floating-point imprecision, the results of what you
  put and what you get may be a little different. I ran a test just smashing in
  the character <code>A</code> testing many different string lengths and look
  how it performed:</p>
<Codeblock filename="output" copyEnabled={false} code={`
Testing string with length 1
A
Maximum: 1; Iteration: 1
Testing string with length 2
AA
Maximum: 2; Iteration: 2
Testing string with length 3
AAA
Maximum: 3; Iteration: 3
Testing string with length 4
AAAA
Maximum: 4; Iteration: 4
Testing string with length 5
AAAAA
Maximum: 5; Iteration: 5
Testing string with length 6
AAAAAA
[ ... normal output ... ]
Maximum: 52; Iteration: 52
Testing string with length 53
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@���
Maximum: 52; Iteration: 53
Testing string with length 54
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA 
Maximum: 54; Iteration: 54
Testing string with length 55
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AA@�
Maximum: 51; Iteration: 55
Testing string with length 56
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Maximum: 56; Iteration: 56
Testing string with length 57
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAACA  
Maximum: 51; Iteration: 57
Testing string with length 58
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAAAAAABA@��
Maximum: 47; Iteration: 58
Testing string with length 59
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA?AAABAA@�
Maximum: 51; Iteration: 59
Testing string with length 60
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAABAAA<
Maximum: 51; Iteration: 60
Testing string with length 61
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAABAAADAAACA 
Maximum: 47; Iteration: 61
Testing string with length 62
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAADAAADA@��
Maximum: 51; Iteration: 62
Testing string with length 63
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAADAAA;AA@�
Maximum: 51; Iteration: 63
Testing string with length 64
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAA@AAAAAAA>AAA>
Maximum: 47; Iteration: 64
Testing string with length 65
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAAEAAADAAANAAAIA  >
Maximum: 47; Iteration: 65
Testing string with length 66
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAACAAAGAAA:AAARAA �
Maximum: 47; Iteration: 66
Testing string with length 67
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAAAAAAEAAA4AAARAAA<
Maximum: 47; Iteration: 67
Testing string with length 68
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA?AAA?AAAGAAAGAAAPAAA�
Maximum: 47; Iteration: 68
Testing string with length 69
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAACAAACAAARAAAQAAA9AAAc@���
Maximum: 39; Iteration: 69
Testing string with length 70
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAABAAAYAAAAAAAbAAA�AA �
Maximum: 47; Iteration: 70
Testing string with length 71
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAADAAA?AAAPAAA5AAAAAAmAA@�
Maximum: 43; Iteration: 71
Testing string with length 72
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAEAAAYAAAYAAAzAAA�AAA�
Maximum: 47; Iteration: 72
Testing string with length 73
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAAAAAAAAAAKAAAYAA@�AAA:AA@�AA>�@���
Maximum: 39; Iteration: 73
Testing string with length 74
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAAAAAABAAAHAAACAA@�AAApAAB�AAA�AA�
Maximum: 39; Iteration: 74
Testing string with length 75
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAEAAAOAAA^AA@�AAA�AAB'AAAAD�
Maximum: 43; Iteration: 75
Testing string with length 76
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAA@AAA>AAA@AAA9AA@�AAAQAAA�AAA�AAC*
Maximum: 39; Iteration: 76
Testing string with length 77
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=AAADAAA6AA@�AA@�AAB,AAAlAA>^AA6�@���
Maximum: 43; Iteration: 77
Testing string with length 78
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAA>AAAGAAA8AAAAA@�AAB.AAB�AA>�AA>A@��
Maximum: 39; Iteration: 78
Testing string with length 79
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA?AAAEAAA7AA@�AA@�AAB9AAB�AAA>AAAsAAJ�
Maximum: 43; Iteration: 79
Testing string with length 80
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAA=AAABAAA*AA@�AA@gAAAEAA=�AA:�AA6�AA,�
Maximum: 39; Iteration: 80
Testing string with length 81
�
Maximum: 43; Iteration: 81
Testing string with length 82
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAGAAA9AAABAAA}AA@�AA@AACtAAI^AA8/AA+�A@�T
Maximum: 39; Iteration: 82
Testing string with length 83
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAHAAA@AAAFAAA@AAAAA?1AAAiAACWAA0�AA*0AA{�
Maximum: 39; Iteration: 83
Testing string with length 84
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAIAAAAAAAQAAA�AAA+AA?�AA@�AAHIAA43AA+�AA?�
Maximum: 39; Iteration: 84
Testing string with length 85
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJAAA-AAAPAABAA@�AA?FAAIqAA5�AAAAPA@�v@�Y�
Maximum: 43; Iteration: 85
Testing string with length 86
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAASAAA'AAAeAAB5AA@�AA?jAAGAAA�AAD�AA15AAX(A@��
Maximum: 39; Iteration: 86
Testing string with length 87
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAANAAA AAADAAA�AA@LAA?3AAC�AA9�AA9eAAH�AA;�A@�}
Maximum: 39; Iteration: 87
Testing string with length 88
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAACAAAPAAA%AAAOAABAA@AA?�AAJ-AAJ�AA:AAb}AA�AB�~
Maximum: 35; Iteration: 88
Testing string with length 89
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAAMAAAKAAAAA@JAA>GAA?�AAJ�AAXHA@�qAA-�A?�eA?�@�(5
Maximum: 39; Iteration: 89
Testing string with length 90
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAAIAAARAA@�AA@kAA=�AA>]AARAAW�AA!PAAR�A@��A@�vAA��
Maximum: 39; Iteration: 90
Testing string with length 91
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAA?AAABAAAIAA@�AA@wAA=�AA>�AAO�AAacAA4�AA]�AAPAA"�A@u
Maximum: 35; Iteration: 91
Testing string with length 92
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAA[AAAAA@�AA>�AA@�AAQ�AAYWAA[A@�$AA��A@�A?��
Maximum: 43; Iteration: 92
Testing string with length 93
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAGAAALAAA.AAA�AAA�AAE�AAGUAAQrAAt�AA	3A@��AAC�AC3�A?��A ��
Maximum: 35; Iteration: 93
Testing string with length 94
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAJAAAOAAA,AAA�AAB:AAEUAAJnAAX"AAF�AA�AA@kAB�3AEzLAG�AIJ�
Maximum: 35; Iteration: 94
Testing string with length 95
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAFAAAAAAAAAA�AAB�AAEAAJ�AAOQAA�A@��AA@�AA�AA�OA?H�A9�w
Maximum: 35; Iteration: 95
Testing string with length 96
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAJAAAUAAA3AAA�AAB�AADMAAH AAU$AAc)AA�AA'sAA�:A@j�A;�iA9Xe
Maximum: 35; Iteration: 96
Testing string with length 97
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAA@AAA7AAAHAAA�AA?�AAADAACMAA?�AAG�AA9�AWAA>�AA��A>ACH�@�6�
Maximum: 31; Iteration: 97
Testing string with length 98
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@AAA5AAAHAAA�AA@oAA@�AAA4AAA�AAUjAA&@AAyA@��AA�A?H�AA��A:�a
Maximum: 39; Iteration: 98
Testing string with length 99
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAABAAAAAAA<AAAXAAA�AA@AA@KAAB�AA9!AAG�AA�AA�AAj�AIA>$1ADHzA/ג
Maximum: 31; Iteration: 99
Testing string with length 100
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAABAAAAAAA<AAACAAA�AA@5AA@�AAB$AA:�AAN�AA(HAAN�A@�$AA�cA=b�A=��A2�)
Maximum: 31; Iteration: 100
`} />
<p>So yeah, this algorithm isn&#39;t perfect by any means. Your data could
  actually get corrupted because of floating-point imprecision. I suppose if we
  do this in such a system such that real numbers don&#39;t have limitations
  and/or rational numbers exist without limitations or if we&#39;re unbounded by
  floating-point precision, then this should work as expected.</p>
<p>Another limitation is how it encodes data, more specifically how it packs 4
  bytes to an <code>int</code>. It could be better, I haven&#39;t tried
  <code>short</code>s, <code>long</code>s, or any other ways to encode data onto
  a real number.</p>
<p>And if we were to store this in a file, thinking we&#39;d save some space by
  storing data into coefficients as numbers, sorry. A <code>double</code> is 8
  bytes. We need <code>n</code> number of doubles to store <code>n</code> amount
  of coefficients, and the amount of coefficients depend of the length of the
  data. So we&#39;d be wasting more data as we have to store <code>8 *
    length_of_data</code> bytes we need for the polynomial.</p>
{@render header(2, "Conclusion")}
<p>All of this started because I was curious during a Math lesson in school. I
  had my hypothesis, tested it, experimented with it, and was successful with
  it. But not everything I had was perfect, as you can see with the limitations.
</p>
<p>I was considering implementing some sort of a &quot;real number&quot; system
  in Java, but I just couldn&#39;t allocate time into it.</p>
<p>I would consider this as a little magic trick you could show to your friends
  to show how good your math skills are. Just explain how it works and have them
  magically decode their data and unpacking <code>int</code>s.</p>
<p>I could store secret little hidden messages on it, like how I did on the
  first line of the <code>main</code> function. I redacted the name to
  <code>???</code> so y&#39;all won&#39;t know who it is. It&#39;s obfuscated
  enough to not let other people know the data that is inside it.</p>
<p>Anyways, whatever you do with it, thank you for reading this writeup!! I have
  plans to make more writeups and I would like to do more. I would like to
  document my programming and life experiences within it, maybe to go into depth
  about this cool project I made, or the intricate technical details of what I
  just built, or about me if I feel like it.</p>